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
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false)
    }
  }, [])

  // 🔹 Salvar contato
  const saveContact = useCallback(async (displayName: string, number: string, instanceName: string) => {
    if (!displayName || !number) return
    setError(null)

    try {
      const body = { DisplayName: displayName, Number: number, InstanceName: instanceName }

      const response = await secureApiCall<ContactDto>(`${API_CONFIG.ENDPOINTS.CHAT}/contacts/save`, {
        method: "POST",
        body: JSON.stringify(body),
      })

      if (response.hasError) throw new Error(response.message ?? "Erro ao salvar contato")

      let newContact: ContactDto = {
        id: Date.now().toString(),
        displayName,
        number: number
      };

      if (response.data)
        newContact = response.data;

      setContacts(prev => [...prev, newContact]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    }
  }, [])

    // 🔹 Atualizar contato
  const updateContact = useCallback(async (contactId: string, displayName: string, number: string, instanceName: string, profilePicture: File | null) => {
    if (!displayName || !number) return
    setError(null)

    try {
      const form = new FormData();
      
      form.append("displayName", displayName);
      form.append("number", number);

      if (instanceName)
        form.append("instanceName", instanceName);

      if (profilePicture)
        form.append("profilePicture", profilePicture);

      const response = await secureApiCall<ContactDto>(`${API_CONFIG.ENDPOINTS.CHAT}/contacts/${contactId}/update`, {
        method: "PUT",
        body: form,
      })

      if (response.hasError) throw new Error(response.message ?? "Erro ao salvar contato")

      let newContact: ContactDto = {
        id: contactId,
        displayName,
        number: number
      };

      if (response.data)
        newContact = response.data;

      setContacts(prev => {
        const exists = prev.some(c => c.id === newContact.id);
        if (exists) {
          return prev.map(c => c.id === newContact.id ? newContact : c);
        }
        return [...prev, newContact];
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
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
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
    }
  }, [])

  // 🔹 Enviar mensagem
  const sendMessage = useCallback(async (contactId: string, text: string) => {
    if (!contactId || !text) return
    setError(null)

    try {
      const body = { conversation: text }

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
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    }
  }, [])

  const sendAttachment = useCallback(async (contactId: string, attachment: File) => {
    if (!contactId || !attachment) return
    setError(null)

    try {

      const form = new FormData();
      
      form.append("attachment", attachment);

      const response = await secureApiCall<MessageDto>(`${API_CONFIG.ENDPOINTS.CHAT}/messages/${contactId}/send/attachment`, {
        method: "POST",
        body: form,
      })

      if (response.hasError) throw new Error(response.message ?? "Erro ao enviar anexo")
      
      const url = URL.createObjectURL(attachment);

      let newMessage: MessageDto = {
        id: Date.now().toString(),
        content: "",
        base64: url,
        sentAt: new Date(),
        status: MessageStatusEnum.Created,
        isFromMe: true,
        contactId: contactId,
        contact: {
          lastMessage: "Anexo enviado",
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
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    }
  }, [])

  // 🔹 Deletar mensagem
  const deleteMessage = useCallback(async (contactId: string, message: MessageDto) => {
    if (!contactId || !message.id) return
    setError(null)

    try {
      const body = { id: message.id }

      const response = await secureApiCall<MessageDto>(`${API_CONFIG.ENDPOINTS.CHAT}/messages/${contactId}/delete`, {
        method: "POST",
        body: JSON.stringify(body),
      })

      if (response.hasError) throw new Error(response.message ?? "Erro ao deletar mensagem")
      
      setMessages((prev) => ({
        ...prev,
        [contactId]: [...(prev[contactId].filter((m) => m.id !== message.id) || [])],
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    }
  }, [])

  // 🔹 Encaminhar mensagem
  const forwardMessage = useCallback(async (contactId: string, message: MessageDto | null) => {
    if (!contactId || !message?.id) return
    setError(null)

    try {
      const body = { id: message.id }

      const response = await secureApiCall<MessageDto>(`${API_CONFIG.ENDPOINTS.CHAT}/messages/${contactId}/forward`, {
        method: "POST",
        body: JSON.stringify(body),
      })

      if (response.hasError) throw new Error(response.message ?? "Erro ao encaminhar mensagem")
      
      setMessages((prev) => ({
        ...prev,
        [contactId]: [...(prev[contactId] || [])],
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    }
  }, [])

  const sendQuotedMessage = useCallback(async (contactId: string, message: MessageDto, text: string) => {
    if (!contactId || !message.id || !text) return
    setError(null)

    try {
      const body = { conversation: text, key: { id: message.id } }

      const response = await secureApiCall<MessageDto>(`${API_CONFIG.ENDPOINTS.CHAT}/messages/${contactId}/send/quoted`, {
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
        quotedMessage: message,
        quotedMessageId: message.id,
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
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    }
  }, [])

  const sendReactionMessage = useCallback(async (contactId: string, message: MessageDto, reaction: string) => {
    if (!contactId || !message.id || !reaction) return
    setError(null)

    try {
      const body = { reaction: reaction, key: { id: message.id } }

      const response = await secureApiCall<MessageDto>(`${API_CONFIG.ENDPOINTS.CHAT}/messages/${contactId}/send/reaction`, {
        method: "POST",
        body: JSON.stringify(body),
      })

      if (response.hasError) throw new Error(response.message ?? "Erro ao enviar a reação da mensagem")
      
      setMessages(prev => {
        const messages = prev[contactId] || []
        const updated = messages.map(m => {
          if (m.id !== message.id) return m

          return {
            ...m,
            reactions: [
              ...(m.messageReactions || []),
              {
                reaction: reaction,
                fromMe: true,
                createdAt: new Date()
              }
            ]
          }
        })

        return {
          ...prev,
          [contactId]: updated
        }
      })
      console.log(messages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
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
    updateContact,
    fetchMessages,
    sendMessage,
    sendAttachment,
    deleteMessage,
    forwardMessage,
    sendQuotedMessage,
    sendReactionMessage,
    loading,
    error,
    setError,
    clearError: () => setError(null),
  }
}
