"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Plus, CheckCheck } from 'lucide-react'
import { cn } from "@/lib/utils"
import { ChangeEvent, useEffect, useState } from "react"
import { ContactDto } from "@/types/DTOs/contactDto.interface"
import { PhoneInput } from "@/components/ui/custom/phone-input"
import { flags } from "@/lib/flag-utils"

interface ConversationListProps {
  contacts: ContactDto[]
  selectedId: string | null
  onAddContact: (contactName: string, phoneNumber: string) => void
  onSelect: (id: string) => void
}

export function ConversationList({ contacts, selectedId, onAddContact, onSelect }: ConversationListProps) {
  const [filtered, setFiltered] = useState<ContactDto[]>([])
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  const [contactName, setContactName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [countryCode, setCountryCode] = useState("BR")

  useEffect(() => {
    if (!search) {
      setFiltered(contacts)
    } else {
      const result = contacts.filter(conv =>
        (conv.displayName || conv.number).toLowerCase().includes(search.toLowerCase())
      )
      setFiltered(result)
    }
  }, [contacts, search])

  function inputChange(event: ChangeEvent<HTMLInputElement>): void {
    setSearch(event.currentTarget.value)
  }

  function handleAddContact() {
    onAddContact(contactName, `${flags[countryCode].dialCodeOnlyNumber}${phoneNumber}`);    
    setContactName("")
    setPhoneNumber("")
    setOpen(false)
  }

  return (
    <div className="w-80 border-r border-border bg-card flex flex-col">
      <div className="p-4 border-b border-border">
        <h1 className="text-xl font-semibold mb-4">Mensagens</h1>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar conversas..."
              className="pl-9"
              value={search}
              onChange={inputChange}
            />
          </div>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="icon" variant="default">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Adicionar novo contato</DialogTitle>
                <DialogDescription>
                  Preencha os dados do novo contato para iniciar uma conversa.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome do contato</Label>
                  <Input
                    id="name"
                    placeholder="Digite o nome..."
                    autoComplete="off"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Número de telefone</Label>
                  <PhoneInput
                    id="phone"
                    countryCode={countryCode}
                    autoComplete="off"
                    value={phoneNumber}
                    onChange={(value) => setPhoneNumber(value)}></PhoneInput>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddContact}>Adicionar contato</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => onSelect(`${conversation.id}`)}
            className={cn(
              "w-full p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors border-b border-border",
              selectedId === conversation.id && "bg-muted",
            )}
          >
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage src={conversation.profilePictureUrl || "/placeholder.svg"} alt={(conversation.displayName || conversation.number)} />
                <AvatarFallback>{(`${conversation.displayName || conversation.number}`).charAt(0)}</AvatarFallback>
              </Avatar>
              {conversation.lastKnownPresence && (
                <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-card" />
              )}
            </div>

            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-baseline justify-between gap-2 mb-1">
                <p className="font-medium truncate">{(conversation.displayName || conversation.number)}</p>
                <span className="text-xs text-muted-foreground shrink-0">
                  {conversation.lastMessageAt != null ? new Date(conversation.lastMessageAt).toLocaleDateString("pt-BR", { timeZone: "UTC" }) : null}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-muted-foreground flex items-center gap-1 truncate">
                  {conversation.lastMessageFromMe && (
                    <CheckCheck className="h-3.5 w-3.5 shrink-0" />
                  )}
                  <span className="truncate">{conversation.lastMessage}</span>
                </p>
                {(conversation.unread || 0) > 0 && (
                  <Badge
                    variant="default"
                    className="h-5 min-w-5 rounded-full flex items-center justify-center px-1.5 bg-primary"
                  >
                    {conversation.unread}
                  </Badge>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
