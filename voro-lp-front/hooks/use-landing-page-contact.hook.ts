import { useState } from "react"
import { LandingPageContactDto } from "@/types/DTOs/landingPageContactDto.interface"

export function useLandingPageContact() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // GET messages
  const getMessages = async (): Promise<LandingPageContactDto[]> => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/contact", {
        cache: "no-store"
      })

      if (!res.ok) throw new Error("Erro ao carregar mensagens")

      const data = await res.json()

      if (!Array.isArray(data.messages)) {
        console.warn("❗ data.messages não é array:", data.messages)
        return []
      }

      return data.messages as LandingPageContactDto[]
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
      return []
    } finally {
      setLoading(false)
    }
  }

  // PUT read/unread
  const markAsRead = async (id: string, read: boolean) => {
    try {
      const res = await fetch("/api/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isRead: read }),
      })

      if (!res.ok) throw new Error("Erro ao marcar como lida")
    } catch (err) {
      console.error(err)
      setError("Erro ao atualizar status")
    }
  }

  // DELETE
  const deleteMessage = async (id: string) => {
    try {
      const res = await fetch("/api/contact", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error("Erro ao apagar mensagem")
    } catch (err) {
      console.error(err)
      setError("Erro ao apagar mensagem")
    }
  }

  // POST
  const postLandingPageContact = async (contact: LandingPageContactDto) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact),
      })
      if (!res.ok) {
        const errorData = await res.json().catch(() => null)
        throw new Error(errorData?.message || "Erro ao enviar a mensagem")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    clearError: () => setError(null),
    getMessages,
    markAsRead,
    deleteMessage,
    postLandingPageContact,
  }
}
