export interface ContactDto {
  id?: string;
  number: string;
  displayName?: string;
  profilePictureUrl?: string;
  lastKnownPresence?: string;
  lastMessageAt?: string;
  lastPresenceAt?: string;
  lastMessage?: string;
  lastMessageFromMe?: boolean;
  unread?: number;
}