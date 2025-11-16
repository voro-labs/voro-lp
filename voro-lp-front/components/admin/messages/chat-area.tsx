"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Phone, Video, MoreVertical, Mic, Paperclip, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ContactDto } from "@/types/DTOs/contactDto.interface";
import { MessageDto } from "@/types/DTOs/messageDto.interface";
import { MessageStatus } from "./message-status";
import { MessageReactions } from "./message-reactions";
import { MessageContent } from "./message-content";
import { TypingIndicator } from "./typing-indicator";
import { MessageActions } from "./message-actions";

interface ChatAreaProps {
  contact?: ContactDto;
  messages: MessageDto[];
  onSendMessage: (text: string, quotedMessageId?: string) => void;
  onReact?: (message: MessageDto, emoji: string) => void;
  onReply?: (message: MessageDto) => void;
  onForward?: (message: MessageDto) => void;
  onDelete?: (message: MessageDto) => void;
  isTyping?: boolean;
}

export function ChatArea({
  contact,
  messages,
  onSendMessage,
  onReact,
  onReply,
  onForward,
  onDelete,
  isTyping = false,
}: ChatAreaProps) {
  const [inputValue, setInputValue] = useState("");
  const [quotedMessage, setQuotedMessage] = useState<MessageDto | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue, quotedMessage?.id);
      setInputValue("");
      setQuotedMessage(null);
    }
  };

  const handleReply = (message: MessageDto) => {
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
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-muted-foreground/50">
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
          <Button type="button" variant="ghost" size="icon">
            <Paperclip className="h-5 w-5" />
          </Button>

          <Input
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
            <Button type="button" variant="ghost" size="icon">
              <Mic className="h-5 w-5" />
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}