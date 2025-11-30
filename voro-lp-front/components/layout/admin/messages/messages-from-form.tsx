"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { motion, AnimatePresence } from "framer-motion"
import { Loader2, ArrowLeft, Mail, MailOpen, Trash2, Eye, User, Calendar, Globe, Inbox, RefreshCw, FileText } from "lucide-react"
import { useLandingPageContact } from "@/hooks/use-landing-page-contact.hook"
import { LandingPageContactDto } from "@/types/DTOs/landingPageContactDto.interface"

export default function MessagesFromForm() {
  const [messages, setMessages] = useState<LandingPageContactDto[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<LandingPageContactDto | null>(null)
  const [deleteMessage, setDeleteMessage] = useState<LandingPageContactDto | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const router = useRouter()
  const { getMessages, markAsRead, deleteMessage: deleteMsg } = useLandingPageContact()

  useEffect(() => {
    loadMessages()
  }, [])

  const loadMessages = async () => {
    const data = await getMessages()
    setMessages(data)
    setLoading(false)
    setRefreshing(false)
  }

  const handleRefresh = () => {
    setRefreshing(true)
    loadMessages()
  }

  const handleView = async (message: LandingPageContactDto) => {
    setSelectedMessage(message)
    if (!message.isRead) {
      await markAsRead(message.id, true)
      setMessages(messages.map((m) => (m.id === message.id ? { ...m, isRead: true } : m)))
    }
  }

  const handleDelete = async () => {
    if (!deleteMessage) return

    await deleteMsg(deleteMessage.id)
    setMessages(messages.filter((m) => m.id !== deleteMessage.id))
    setDeleteMessage(null)
  }

  const handleCreateProposal = (message: LandingPageContactDto) => {
    const params = new URLSearchParams({
      contactId: message.id.toString(),
      clientName: message.name,
      clientEmail: message.email,
    })
    router.push(`/admin/proposals/new?${params.toString()}`)
  }

  const unreadCount = messages.filter((m) => !m.isRead).length

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/admin/dashboard")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <motion.h1
                className="text-2xl md:text-3xl font-bold"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                Mensagens de Contato
              </motion.h1>
              <p className="text-muted-foreground text-sm">
                {messages.length} mensagens • {unreadCount} não lidas
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
        </div>

        {/* Messages List */}
        {messages.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Inbox className="w-16 h-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">Nenhuma mensagem ainda</h3>
              <p className="text-sm text-muted-foreground/70">
                As mensagens enviadas pelo formulário de contato aparecerão aqui.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className={`cursor-pointer transition-all hover:shadow-lg hover:border-primary/30 ${
                      !message.isRead ? "border-l-4 border-l-primary bg-primary/5" : ""
                    }`}
                    onClick={() => handleView(message)}
                  >
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`p-2 rounded-full ${!message.isRead ? "bg-primary/20" : "bg-muted"}`}>
                            {message.isRead ? (
                              <MailOpen className="w-5 h-5 text-muted-foreground" />
                            ) : (
                              <Mail className="w-5 h-5 text-primary" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3
                                className={`font-semibold ${!message.isRead ? "text-foreground" : "text-muted-foreground"}`}
                              >
                                {message.name}
                              </h3>
                              {!message.isRead && (
                                <Badge variant="default" className="text-xs">
                                  Nova
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{message.email}</p>
                            <p className="text-sm mt-1 line-clamp-2 text-foreground/80">{message.message}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 md:flex-col md:items-end">
                          <span className="text-xs text-muted-foreground">
                            {new Date(`${message.createdAt}`).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
                          </span>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleView(message)
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation()
                                setDeleteMessage(message)
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* View Message Dialog */}
        <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Detalhes da Mensagem
              </DialogTitle>
              <DialogDescription>Mensagem recebida pelo formulário de contato</DialogDescription>
            </DialogHeader>
            {selectedMessage && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <User className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Nome</p>
                      <p className="font-medium">{selectedMessage.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <a href={`mailto:${selectedMessage.email}`} className="font-medium text-primary hover:underline">
                        {selectedMessage.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Data de Recebimento</p>
                      <p className="font-medium">
                        {new Date(`${selectedMessage.receiveDate}`).toLocaleDateString("pt-BR", { timeZone: "UTC" })} às{" "}
                        {new Date(`${selectedMessage.receiveDate}`).toLocaleTimeString("pt-BR", { timeZone: "UTC",})}
                      </p>
                    </div>
                  </div>
                  {selectedMessage.ipAddress && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Globe className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Endereço IP</p>
                        <p className="font-medium">{selectedMessage.ipAddress}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-2">Mensagem</p>
                  <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full justify-end">
                  <Button
                    variant="default"
                    onClick={() => handleCreateProposal(selectedMessage)}
                    className="gap-2 col-span-1 sm:col-span-3"
                  >
                    <FileText className="w-4 h-4" />
                    Criar Proposta Comercial
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => markAsRead(selectedMessage.id, !selectedMessage.isRead)}
                    className="gap-2 col-span-1 sm:col-span-2"
                  >
                    {selectedMessage.isRead ? (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Marcar como não lida
                      </>
                    ) : (
                      <>
                        <MailOpen className="w-4 h-4 mr-2" />
                        Marcar como lida
                      </>
                    )}
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() => {
                      setSelectedMessage(null)
                      setDeleteMessage(selectedMessage)
                    }}
                    className="gap-2 col-span-1 sm:col-span-1"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!deleteMessage} onOpenChange={() => setDeleteMessage(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir a mensagem de <strong>{deleteMessage?.name}</strong>? Esta ação não pode
                ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeleteMessage(null)}
              >
                Cancelar
              </Button>
              <Button 
                type="button"
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
