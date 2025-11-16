import { useState, useEffect, useCallback } from "react"
import { API_CONFIG, secureApiCall } from "@/lib/api"
import { ContactDto } from "@/types/DTOs/contactDto.interface"
import { MessageDto } from "@/types/DTOs/messageDto.interface"
import { MessageStatusEnum } from "@/types/Enums/messageStatusEnum.enum"

export function useEvolutionChat() {
  const [contacts, setContacts] = useState<ContactDto[]>([])
  const [messages, setMessages] = useState<Record<string, MessageDto[]>>({})
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleApiError = (message: string, err?: unknown) => {
    console.error(message, err)
    setError(message)
  }

  // 🔹 Buscar contatos
  const fetchContacts = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await secureApiCall<ContactDto[]>(`${API_CONFIG.ENDPOINTS.CHAT}/contacts`, {
        method: "GET",
      })

      if (response.hasError) throw new Error(response.message ?? "Erro ao carregar contatos")

      setContacts(response.data ?? [])
    } catch (err) {
      handleApiError("Erro ao carregar contatos", err)
    } finally {
      setLoading(false)
    }
  }, [])

  // 🔹 Enviar mensagem
  const saveContact = useCallback(async (name: string, number: string, instanceName: string) => {
    if (!name || !number) return
    setError(null)

    try {
      const body = { Name: name, Number: number }

      const response = await secureApiCall<ContactDto>(`${API_CONFIG.ENDPOINTS.CHAT}/contacts/save`, {
        method: "POST",
        body: JSON.stringify(body),
      })

      if (response.hasError) throw new Error(response.message ?? "Erro ao salvar contato")

      let newContact: ContactDto = {
        id: Date.now().toString(),
        displayName: name,
        number: number
      };

      if (response.data)
        newContact = response.data;

      setContacts(prev => [...prev, newContact]);
    } catch (err) {
      handleApiError("Erro ao enviar mensagem", err)
    }
  }, [])

  // 🔹 Buscar mensagens com um contato
  const fetchMessages = useCallback(async (contactId: string) => {
    if (!contactId) return
    setError(null)

    try {
      const response = await secureApiCall<MessageDto[]>(`${API_CONFIG.ENDPOINTS.CHAT}/messages/${contactId}`, {
        method: "GET",
      })

      if (response.hasError) throw new Error(response.message ?? "Erro ao carregar mensagens")

      setMessages((prev) => ({
        ...prev,
        [contactId]: response.data ?? [],
      }))
    } catch (err) {
      handleApiError("Erro ao carregar mensagens", err)
    } finally {
    }
  }, [])

  // 🔹 Enviar mensagem
  const sendMessage = useCallback(async (contactId: string, text: string) => {
    if (!contactId || !text) return
    setError(null)

    try {
      const body = { content: text }

      const response = await secureApiCall<MessageDto>(`${API_CONFIG.ENDPOINTS.CHAT}/messages/${contactId}/send`, {
        method: "POST",
        body: JSON.stringify(body),
      })

      if (response.hasError) throw new Error(response.message ?? "Erro ao enviar mensagem")
      
      let newMessage: MessageDto = {
        id: Date.now().toString(),
        content: text,
        sentAt: new Date(),
        status: MessageStatusEnum.Created,
        isFromMe: true,
        contactId: contactId,
        contact: {
          lastMessage: text,
          lastMessageAt: Date.now.toString()
        } as ContactDto,
        messageReactions: []
      };

      if (response.data)
        newMessage = response.data;

      setMessages((prev) => ({
        ...prev,
        [contactId]: [...(prev[contactId] || []), newMessage],
      }))
    } catch (err) {
      handleApiError("Erro ao enviar mensagem", err)
    }
  }, [])

  // 🔹 Atualizar mensagens periodicamente (simulação de webhook)
  useEffect(() => {
    if (!selectedContactId) return
    const interval = setInterval(() => {
      fetchMessages(selectedContactId)
    }, 5000)
    return () => clearInterval(interval)
  }, [selectedContactId, fetchMessages])

  // 🔹 Buscar contatos e conversas ao iniciar
  useEffect(() => {
    fetchContacts()
  }, [fetchContacts])

  return {
    contacts,
    messages,
    selectedContactId,
    setSelectedContactId,
    fetchContacts,
    saveContact,
    fetchMessages,
    sendMessage,
    loading,
    error,
    clearError: () => setError(null),
  }
}
