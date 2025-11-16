"use client"

import { Loading } from "@/components/loading/loading.component"
import { ConversationList } from "./conversation-list"
import { ChatArea } from "./chat-area"
import { useEvolutionChat } from "@/hooks/use-evolution-chat.hook"

export default function Messages() {
  const {
    contacts,
    messages,
    selectedContactId,
    setSelectedContactId,
    fetchMessages,
    sendMessage,
    saveContact,
    loading,
    error,
  } = useEvolutionChat()

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
            saveContact(name, phoneNumber, '')
          }}
        />

        <div className="h-screen w-full">
          {/* 🔹 Área do chat */}
          <ChatArea
            contact={contacts.find((c) => c.id === selectedContactId)}
            messages={selectedMessages}
            onSendMessage={(text) => selectedContactId && sendMessage(selectedContactId, text)}
          />
        </div>
      </div>
    </div>
  )
}
