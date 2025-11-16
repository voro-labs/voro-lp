import { ChatDto } from "./chatDto.interface"

export interface InstanceDto {
  id: string
  externalId: string
  updatedAt: Date
  chats: ChatDto[]
}


