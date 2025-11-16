import { ContactDto } from "./contactDto.interface";
import { MessageDto } from "./messageDto.interface";

export interface MessageReactionDto {
  id: string;
  reaction: string;
  contactId?: string;
  contact?: ContactDto;
  createdAt: Date;
  messageId?: string;
  message?: MessageDto;
}