import { ContactDto } from "./contactDto.interface"
import { GroupDto } from "./groupDto.interface"
import { InstanceDto } from "./instanceDto.interface"
import { MessageDto } from "./messageDto.interface"

export interface ChatDto {
  id: string
  remoteJid: string
  isGroup: boolean
  instanceId: string
  instance: InstanceDto
  lastMessageAt: Date
  updatedAt: Date
  contactId?: string
  contact?: ContactDto
  groupId?: string
  group?: GroupDto
  messages: MessageDto[]
}
