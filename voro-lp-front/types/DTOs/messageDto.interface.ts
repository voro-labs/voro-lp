import { MessageStatusEnum } from "../Enums/messageStatusEnum.enum";
import { MessageTypeEnum } from "../Enums/messageTypeEnum.enum";
import { ChatDto } from "./chatDto.interface";
import { ContactDto } from "./contactDto.interface";
import { GroupDto } from "./groupDto.interface";
import { MessageReactionDto } from "./messageReactionDto.interface";

export interface MessageDto {
  id?: string;
  externalId?: string;
  remoteFrom?: string;
  remoteTo?: string;
  base64?: string;
  content: string;
  rawJson?: string;
  sentAt: Date;
  isFromMe: boolean;
  status: MessageStatusEnum;
  updatedAt?: Date;
  type?: MessageTypeEnum;
  mimeType?: string;
  fileUrl?: string;
  fileLength?: number;
  width?: number;
  height?: number;
  durationSeconds?: number;
  thumbnail?: number[];
  contactId?: string;
  contact?: ContactDto;
  groupId?: string;
  group?: GroupDto;
  chatId?: string;
  chat?: ChatDto;
  quotedMessageId?: string;
  quotedMessage?: MessageDto;
  messageReactions: MessageReactionDto[];
}