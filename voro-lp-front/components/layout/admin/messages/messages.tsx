"use client"

import { Loading } from "@/components/ui/custom/loading/loading"
import { ConversationList } from "./conversation-list"
import { ChatArea } from "./chat-area"
import { useEvolutionChat } from "@/hooks/use-evolution-chat.hook"
import { ErrorPopup } from "@/components/ui/custom/error-popup"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { MessageDto } from "@/types/DTOs/messageDto.interface"

export default function Messages() {
  const {
    contacts,
    messages,
    selectedContactId,
    setSelectedContactId,
    fetchMessages,
    sendMessage,
    sendAttachment,
    deleteMessage,
    forwardMessage,
    sendQuotedMessage,
    sendReactionMessage,
    saveContact,
    updateContact,
    loading,
    error,
    setError,
  } = useEvolutionChat()

  const [dialogOpen, setDialogOpen] = useState(false);
  const [messageToForward, setMessageToForward] = useState<MessageDto | null>(null);
  
  // 🔹 Busca mensagens do contato selecionado
  const selectedMessages = selectedContactId ? messages[selectedContactId] || [] : []

  return (
    <div className="bg-background">
      <Loading isLoading={loading} />

      <div className="flex min-h-screen">
        {/* 🔹 Lista de conversas */}
        <ConversationList
          contacts={contacts}
          selectedId={selectedContactId}
          onSelect={(id) => {
            fetchMessages(id);
            setSelectedContactId(id);
          }}
          onAddContact={(name, phoneNumber) => {
            saveContact(name, phoneNumber, 'voro-evolution')
          }}
        />

        <div className="h-screen w-full">
          {/* 🔹 Área do chat */}
          <ChatArea
            contact={contacts.find((c) => c.id === selectedContactId)}
            messages={selectedMessages}
            onSendMessage={(text, quotedMessage) => {
              if (!selectedContactId) return;

              if (quotedMessage) {
                sendQuotedMessage(selectedContactId, quotedMessage, text)
                return;
              }

              sendMessage(selectedContactId, text)
            }}
            onSendAttachment={(file) => {
              if (!selectedContactId) return;
              sendAttachment(selectedContactId, file)
            }}
            onReact={(message, emoji) => {
              if (!selectedContactId) return;
              sendReactionMessage(selectedContactId, message, emoji)
            }}
            onForward={(message) => {
              setDialogOpen(true);
              setMessageToForward(message);
            }}
            onDelete={(message) => {
              if (!selectedContactId) return;
              deleteMessage(selectedContactId, message);
            }}
            onEditContact={(contactId, name, phoneNumber, profilePicture) => {
              updateContact(contactId, name, phoneNumber, '', profilePicture)
            }}
          />
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Selecionar Contato</DialogTitle>
            <DialogDescription>
              Atualize as informações do contato aqui.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center gap-4">
              {contacts.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => {
                    if (!conversation.id) return;
                    forwardMessage(conversation.id, messageToForward);
                    setMessageToForward(null);
                    setDialogOpen(false);
                  }}
                  className={cn(
                    "w-full p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors border-b border-border",
                    selectedContactId === conversation.id && "bg-muted",
                  )}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={conversation.profilePictureUrl || "/placeholder.svg"} alt={(conversation.displayName || conversation.number)} />
                      <AvatarFallback>{(`${conversation.displayName || conversation.number}`).charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-baseline justify-between mb-1">
                      <p className="font-medium truncate">{(conversation.displayName || conversation.number)}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
