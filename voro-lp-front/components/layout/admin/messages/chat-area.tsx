"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Phone, Video, MoreVertical, Mic, Paperclip, X, Edit } from 'lucide-react';
import { cn } from "@/lib/utils";
import { MessageDto } from "@/types/DTOs/messageDto.interface";
import { MessageStatus } from "./message-status";
import { MessageReactions } from "./message-reactions";
import { MessageContent } from "./message-content";
import { TypingIndicator } from "./typing-indicator";
import { MessageActions } from "./message-actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ContactDto } from "@/types/DTOs/contactDto.interface";
import { AttachmentActions } from "./attachment-actions";
import { PhoneInput } from "@/components/ui/custom/phone-input";
import { flags } from "@/lib/flag-utils";

interface ChatAreaProps {
  contact?: ContactDto;
  messages: MessageDto[];
  onSendMessage: (text: string, quotedMessage?: MessageDto) => void;
  onSendAttachment: (file: File) => void;
  onReact?: (message: MessageDto, emoji: string) => void;
  onReply?: (message: MessageDto) => void;
  onForward?: (message: MessageDto) => void;
  onDelete?: (message: MessageDto) => void;
  isTyping?: boolean;
  onEditContact?: (contactId: string, contactName: string, phoneNumber: string, profilePicture: File | null) => void;
}

export function ChatArea({
  contact,
  messages,
  onSendMessage,
  onSendAttachment,
  onReact,
  onReply,
  onForward,
  onDelete,
  isTyping = false,
  onEditContact,
}: ChatAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [quotedMessage, setQuotedMessage] = useState<MessageDto | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedNumber, setEditedNumber] = useState("");
  const [editedPhoto, setEditedPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [countryCode, setCountryCode] = useState("BR")

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    if (isEditDialogOpen && contact) {
      setEditedName(contact.displayName || "");
      setEditedNumber(contact.number?.slice(2) ?? "");
      setPreviewUrl(contact.profilePictureUrl || "");
      setEditedPhoto(null);
    }
  }, [isEditDialogOpen, contact, messages]);

  function triggerFilePicker(accept: string) {
    if (fileInputRef.current) {
      fileInputRef.current.accept = accept;
      fileInputRef.current.click();
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      e.target.value = "";
      onSendAttachment(file!);
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditedPhoto(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSaveContact = () => {
    if (!contact) return;
    onEditContact?.(`${contact.id}`, editedName, `${flags[countryCode].dialCodeOnlyNumber}${editedNumber}`, editedPhoto);
    setIsEditDialogOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    if (quotedMessage?.id) {
      onSendMessage(inputValue, quotedMessage)
    } else {
      onSendMessage(inputValue)
    }

    setInputValue("");
    setQuotedMessage(null);
  };

  const handleReply = (message: MessageDto) => {
    inputRef.current?.focus();
    setQuotedMessage(message);
    onReply?.(message);
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  if (!contact) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">
            Selecione uma conversa para começar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background h-full max-h-screen">
      {/* Header */}
      <div className="h-16 shrink-0 border-b border-border bg-card flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={contact.profilePictureUrl || "/placeholder.svg"}
                alt={contact.displayName || contact.number}
              />
              <AvatarFallback>
                {(contact.displayName || contact.number).charAt(0)}
              </AvatarFallback>
            </Avatar>
            {contact.lastKnownPresence && (
              <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-card" />
            )}
          </div>
          <div>
            <p className="font-medium">
              {contact.displayName || contact.number}
            </p>
            <p className="text-xs text-muted-foreground">
              {isTyping ? "digitando..." : contact.lastKnownPresence ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setIsEditDialogOpen(true)}>
            <Edit className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" disabled>
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" disabled>
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" disabled>
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="voro-scroll-y">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-2 group",
              message.isFromMe ? "justify-end" : "justify-start"
            )}
          >
            {message.isFromMe && (
              <MessageActions
                message={message}
                onReply={handleReply}
                onForward={onForward}
                onDelete={onDelete}
                onReact={onReact}
                onCopy={handleCopy}
              />
            )}

            <div className="flex flex-col max-w-[70%]">
              <div
                className={cn(
                  "rounded-2xl px-4 py-2",
                  message.isFromMe
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border"
                )}
              >
                {!message.isFromMe && message.group && (
                  <p className="text-xs font-medium text-primary mb-1">
                    {message.contact?.displayName || message.remoteFrom}
                  </p>
                )}

                <MessageContent message={message} isFromMe={message.isFromMe} />

                <div className="flex items-center justify-end gap-1 mt-1">
                  <p
                    className={cn(
                      "text-xs",
                      message.isFromMe
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    )}
                  >
                    {new Date(message.sentAt).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  {message.isFromMe && (
                    <MessageStatus
                      status={message.status}
                      className={cn(
                        message.isFromMe
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      )}
                    />
                  )}
                </div>
              </div>

              <MessageReactions
                reactions={message.messageReactions}
                isFromMe={message.isFromMe}
              />
            </div>

            {!message.isFromMe && (
              <MessageActions
                message={message}
                onReply={handleReply}
                onForward={onForward}
                onDelete={onDelete}
                onReact={onReact}
                onCopy={handleCopy}
              />
            )}
          </div>
        ))}

        {isTyping && <TypingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-border bg-card">
        {quotedMessage && (
          <div className="px-4 pt-3 pb-2 border-b border-border">
            <div className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-primary mb-1">
                  Respondendo a {quotedMessage.isFromMe ? "você mesmo" : quotedMessage.contact?.displayName || "contato"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {quotedMessage.content}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0"
                onClick={() => setQuotedMessage(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4">

          <Input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />

          <AttachmentActions
            onSendImage={() => triggerFilePicker("image/*")}
            onSendDocument={() => triggerFilePicker(".doc,.docx,.txt")}
            onSendPdf={() => triggerFilePicker("application/pdf")}
            onSendZip={() => triggerFilePicker(".zip,.rar,.7zip,.tar.gz")}
            onSendVideo={() => triggerFilePicker("video/*")}
            onSendAudio={() => triggerFilePicker("audio/*")}
          />

          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Digite uma mensagem..."
            className="flex-1"
          />

          {inputValue.trim() ? (
            <Button type="submit" size="icon">
              <Send className="h-5 w-5" />
            </Button>
          ) : (
            <Button type="button" variant="ghost" size="icon" disabled>
              <Mic className="h-5 w-5" />
            </Button>
          )}
        </form>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Contato</DialogTitle>
            <DialogDescription>
              Atualize as informações do contato aqui.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={previewUrl || "/placeholder.svg"}
                  alt="Preview"
                />
                <AvatarFallback>
                  {editedName.charAt(0) || editedNumber.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                Escolher Foto
              </Button>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder="Nome do contato"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="number">Número</Label>
              <PhoneInput
                id="number"
                countryCode={countryCode}
                autoComplete="off"
                value={editedNumber}
                onChange={(value) => setEditedNumber(value)}></PhoneInput>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={handleSaveContact}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
