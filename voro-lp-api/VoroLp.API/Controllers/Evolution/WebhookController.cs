using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1.Ocsp;
using System.Text.Json;
using VoroLp.Application.DTOs.Evolution.Webhook;
using VoroLp.Application.Services.Interfaces.Evolution;
using VoroLp.Domain.Entities.Evolution;
using VoroLp.Domain.Enums;

namespace VoroLp.API.Controllers.Evolution
{
    [Route("api/v{version:version}/[controller]")]
    [Tags("Evolution")]
    [ApiController]
    [AllowAnonymous]
    public class WebhookController(IChatService chatService, IGroupService groupService, IGroupMemberService groupMemberService,
        IContactService contactService, IContactIdentifierService contactIdentifierService, IMessageService messageService,
        IInstanceService instanceService, IEvolutionService evolutionService) : ControllerBase
    {
        private readonly IChatService _chatService = chatService;
        private readonly IGroupService _groupService = groupService;
        private readonly IContactService _contactService = contactService;
        private readonly IMessageService _messageService = messageService;
        private readonly IInstanceService _instanceService = instanceService;
        private readonly IGroupMemberService _groupMemberService = groupMemberService;
        private readonly IContactIdentifierService _contactIdentifierService = contactIdentifierService;
        private readonly IEvolutionService _evolutionService = evolutionService;

        [HttpPost]
        public async Task<IActionResult> Receive([FromBody] JsonElement payload)
        {
            try
            {
                var messageType = payload.GetProperty("event").GetString();

                if (messageType == "qrcode.updated")
                    return NoContent();

                else if (messageType == "connection.update")
                    return NoContent();

                else if (messageType == "messages.set")
                    return NoContent();

                else if (messageType == "messages.upsert")
                    return await MessagesUpsert(payload.Deserialize<MessageUpsertEventDto>()!);

                else if (messageType == "messages.update")
                    return await MessageUpdate(payload.Deserialize<MessageUpdateEventDto>()!);

                else if (messageType == "messages.delete")
                    return NoContent();

                else if (messageType == "send.message")
                    return NoContent();

                else if (messageType == "contacts.set")
                    return NoContent();

                else if (messageType == "contacts.upsert")
                    return NoContent();

                else if (messageType == "contacts.update")
                {
                    if (payload.TryGetProperty("data", out var data))
                    {
                        return data.ValueKind switch
                        {
                            JsonValueKind.Array => await ContactUpdate(payload.Deserialize<ContactsUpdateEventDto>()!),
                            JsonValueKind.Object => await ContactUpdate(payload.Deserialize<ContactUpdateEventDto>()!),
                            _ => throw new Exception("Formato inválido!")
                        };
                    }

                }

                else if (messageType == "presence.update")
                    return await PresenceUpdate(payload.Deserialize<PresenceUpdateEventDto>()!);

                else if (messageType == "chats.set")
                    return NoContent();

                else if (messageType == "chats.update") return NoContent();
                //return await ChatUpdate(payload.Deserialize<ChatUpdateEventDto>()!);

                else if (messageType == "chats.upsert")
                    return NoContent();

                else if (messageType == "chats.delete")
                    return NoContent();

                else if (messageType == "groups.upsert")
                    return NoContent();

                else if (messageType == "groups.update")
                    return NoContent();

                else if (messageType == "group.participants.update")
                    return NoContent();

                else if (messageType == "new.jwt")
                    return NoContent();


                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }


        private async Task<IActionResult> MessagesUpsert(MessageUpsertEventDto eventDto)
        {
            var data = eventDto.Data;
            var key = data.Key;

            // -------- IDENTIDADE / QUAL JID USAR ---------

            var remoteJid = key.RemoteJid;
            var remoteJidAlt = key.RemoteJidAlt;
            var fromMe = key.FromMe;
            var senderFromEnvelope = eventDto.Sender; // vem do ROOT do JSON (correto)

            var pushName = string.IsNullOrWhiteSpace(data.PushName)
                ? "Desconhecido"
                : data.PushName;

            // Criar ou atualizar identificador de RemoteJid ↔ Alt
            ContactIdentifier? identifier = null;

            if (!string.IsNullOrWhiteSpace(remoteJidAlt))
            {
                identifier = await _contactIdentifierService
                    .GetOrCreateAsync(pushName, remoteJid, remoteJidAlt);

                remoteJid = identifier.Contact.RemoteJid;
            }

            // JID final que representa o usuário
            var normalizedJid = remoteJid;


            // -------- VALIDAR MENSAGEM ---------
            string? fileUrl = string.Empty;
            string? content = string.Empty;
            string? base64 = string.Empty;
            MessageTypeEnum messageType = data.MessageType switch
            {
                "imageMessage" => MessageTypeEnum.Image,
                "videoMessage" => MessageTypeEnum.Video,
                "reactionMessage" => MessageTypeEnum.Reaction,
                _ => MessageTypeEnum.Text
            };
            string? mimeType = string.Empty;
            string? messageKey = string.Empty;
            long? fileLength = 0;
            int? width = 0;
            int? height = 0;
            int? durationSeconds = 0;
            byte[]? thumbnail = [];

            var lastMessage = "";

            if (messageType == MessageTypeEnum.Image)
            {
                base64 = data.Message?.Base64 ?? string.Empty;
                mimeType = data.Message?.ImageMessage?.MimeType;
                fileLength = data.Message?.ImageMessage?.FileLength?.High ?? data.Message?.ImageMessage?.FileLength?.Low ?? 0;
                width = data.Message?.ImageMessage?.Width;
                height = data.Message?.ImageMessage?.Height;
                thumbnail = data.Message?.ImageMessage?.JpegThumbnail;
                fileUrl = data.Message?.ImageMessage?.Url;

                lastMessage = "Enviou uma imagem";
            }
            else if (messageType == MessageTypeEnum.Video)
            {
                base64 = data.Message?.Base64 ?? string.Empty;
                mimeType = data.Message?.VideoMessage?.MimeType;
                fileLength = data.Message?.VideoMessage?.FileLength?.High ?? data.Message?.VideoMessage?.FileLength?.Low ?? 0;
                width = data.Message?.VideoMessage?.Width;
                height = data.Message?.VideoMessage?.Height;
                durationSeconds = data.Message?.VideoMessage?.Seconds;
                thumbnail = data.Message?.VideoMessage?.JpegThumbnail;
                fileUrl = data.Message?.VideoMessage?.Url;

                lastMessage = "Enviou um video";
            }
            else if (messageType == MessageTypeEnum.Reaction)
            {
                content = data.Message?.ReactionMessage?.Text ?? string.Empty;
                messageKey = data.Message?.ReactionMessage?.Key.Id ?? string.Empty;

                lastMessage = $"Reagiu com {data.Message?.ReactionMessage?.Text}";
            }
            else
            {
                lastMessage = content;
            }

            content = data.Message?.Conversation ?? string.Empty;

            if (string.IsNullOrWhiteSpace(base64) && string.IsNullOrWhiteSpace(content))
                return NoContent();

            bool isGroup =
                normalizedJid.EndsWith("@g.us");

            bool isContact =
                normalizedJid.EndsWith("@s.whatsapp.net") ||
                normalizedJid.EndsWith("@lid");

            if (!isGroup && !isContact)
                return NoContent();

            // -------- INSTÂNCIA / CHAT ---------

            var (senderContact, group, chat) = await _evolutionService.CreateChatAndGroupOrContactAsync(
                eventDto.Instance, normalizedJid, pushName, remoteJid, isGroup, key.Participant);

            Message? message = await _messageService.Query(item => item.ExternalId == messageKey).FirstOrDefaultAsync();

            if (messageType == MessageTypeEnum.Reaction)
            {
                if (message == null)
                {
                    return NoContent();
                }

                var reaction = new MessageReaction()
                {
                    RemoteFrom = fromMe ? $"{senderFromEnvelope}" : $"{normalizedJid}",
                    RemoteTo = fromMe ? $"{normalizedJid}" : $"{senderFromEnvelope}",
                    ContactId = senderContact?.Id,
                    MessageId = message.Id,
                    Reaction = content,
                    IsFromMe = fromMe
                };

                message.MessageReactions.Add(reaction);

                _messageService.Update(message);
                await _messageService.SaveChangesAsync();
            }
            else
            {
                // -------- CRIAR MENSAGEM ---------

                if (message == null)
                {
                    message = new Message
                    {
                        ExternalId = key.Id,
                        RemoteFrom = fromMe ? $"{senderFromEnvelope}" : $"{normalizedJid}",
                        RemoteTo = fromMe ? $"{normalizedJid}" : $"{senderFromEnvelope}",
                        Content = content,
                        Base64 = base64,
                        IsFromMe = fromMe,
                        SentAt = DateTimeOffset.UtcNow,
                        Status = fromMe ? MessageStatusEnum.Sent : MessageStatusEnum.Delivered,
                        RawJson = JsonSerializer.Serialize(data),
                        Type = messageType,
                        FileUrl = fileUrl,
                        ChatId = chat.Id,
                        ContactId = senderContact?.Id,
                        GroupId = group?.Id,
                        MimeType = mimeType,
                        FileLength = fileLength,
                        Width = width,
                        Height = height,
                        DurationSeconds = durationSeconds,
                        Thumbnail = thumbnail
                    };

                    await _messageService.AddAsync(message);
                }
                else
                {
                    message.Content = content;
                    message.Base64 = base64;
                    message.Status = fromMe ? MessageStatusEnum.Sent : MessageStatusEnum.Delivered;
                    message.RawJson = JsonSerializer.Serialize(data);
                    message.Type = messageType;
                    message.FileUrl = fileUrl;
                    message.MimeType = mimeType;
                    message.FileLength = fileLength;
                    message.Width = width;
                    message.Height = height;
                    message.DurationSeconds = durationSeconds;
                    message.Thumbnail = thumbnail;

                    _messageService.Update(message);
                }

                if (data.ContextInfo?.QuotedMessage != null)
                {
                    var quotedMessage = await _messageService
                        .Query(m => m.ExternalId == data.ContextInfo.StanzaId).FirstOrDefaultAsync();

                    if (quotedMessage != null)
                    {
                        message.QuotedMessageId = quotedMessage.Id;
                    }
                }

                await _messageService.SaveChangesAsync();
            }

            if (senderContact != null && senderContact.Id != Guid.Empty)
            {
                senderContact.LastMessage = lastMessage;

                senderContact.LastMessageFromMe = fromMe;

                senderContact.LastMessageAt = DateTimeOffset.UtcNow;

                _contactService.Update(senderContact);
            }

            if (group != null)
            {
                group.LastMessage = lastMessage;
                
                group.LastMessageFromMe = fromMe;

                group.LastMessageAt = DateTimeOffset.UtcNow;
                
                _groupService.Update(group);
            }
            
            _chatService.Update(chat);

            await _contactService.SaveChangesAsync();
            await _chatService.SaveChangesAsync();

            return Ok(new { success = true });
        }

        private async Task<IActionResult> MessageUpdate(MessageUpdateEventDto eventDto)
        {
            var data = eventDto.Data;

            var message = await _messageService.Query(m => m.ExternalId == data.KeyId).FirstOrDefaultAsync();

            if (message == null)
                return NotFound(new { success = false, message = "Mensagem não encontrada." });

            MessageStatusEnum messageStatus = data.Status switch
            {
                "PENDING" => MessageStatusEnum.Pending,
                "READ" => MessageStatusEnum.Read,
                "SENT" => MessageStatusEnum.Sent,
                "DELIVERY_ACK" => MessageStatusEnum.Delivered,
                "SERVER_ACK" => MessageStatusEnum.Server,
                "FAILED" => MessageStatusEnum.Failed,
                _ => MessageStatusEnum.Created
            };

            message.Status = messageStatus;

            _messageService.Update(message);

            await _messageService.SaveChangesAsync();
            return Ok(new { success = true });
        }

        private async Task<IActionResult> ContactUpdate(ContactUpdateEventDto eventDto)
        {
            var data = eventDto.Data;
            var remoteJid = data.RemoteJid;

            // Ignora JIDs que não são contatos
            if (!remoteJid.EndsWith("@s.whatsapp.net"))
                return NoContent();

            var contactIdentifier = await _contactIdentifierService
                    .GetOrCreateAsync(data.PushName, remoteJid, remoteJid, data.ProfilePicUrl);

            await _contactService.UpdateContact(
                contactIdentifier.Contact,
                data.PushName,
                data.ProfilePicUrl
            );

            await _contactService.SaveChangesAsync();
        
            return Ok(new { success = true });
        }

        private async Task<IActionResult> ContactUpdate(ContactsUpdateEventDto eventDto)
        {
            foreach (var data in eventDto.Data)
            {
                var remoteJid = data.RemoteJid;

                // Ignora JIDs que não são contatos
                if (!remoteJid.EndsWith("@s.whatsapp.net"))
                    return NoContent();

                var contactIdentifier = await _contactIdentifierService
                    .GetOrCreateAsync(data.PushName, remoteJid, remoteJid, data.ProfilePicUrl);

                await _contactService.UpdateContact(
                    contactIdentifier.Contact,
                    data.PushName,
                    data.ProfilePicUrl
                );

                await _contactService.SaveChangesAsync();
            }

            return Ok(new { success = true });
        }

        private async Task<IActionResult> PresenceUpdate(PresenceUpdateEventDto eventDto)
        {
            var data = eventDto.Data;

            foreach (var presence in data.Presences)
            {
                var remoteJid = presence.Key;
                var presenceInfo = presence.Value.LastKnownPresence;

                var contactIdentifier = await _contactIdentifierService
                    .GetOrCreateAsync("", remoteJid, remoteJid, "");

                var contact = contactIdentifier.Contact;

                contact.LastKnownPresence = presenceInfo;
                contact.LastPresenceAt = DateTimeOffset.UtcNow;

                await _contactService.SaveChangesAsync();
            }

            return Ok(new { success = true });
        }


        //private async Task<IActionResult> ChatUpdate(ChatUpdateEventDto eventDto)
        //{
        //    var instance = await _instanceService.GetOrCreateInstance(eventDto.Instance);

        //    foreach (var data in eventDto.Data)
        //    {
        //        var remoteJid = data.RemoteJid;
        //        var (isContact, isGroup) = DetectJidType(remoteJid);

        //        if (!isContact && !isGroup)
        //            continue;

        //        var chat = await _chatService.GetOrCreateChat(remoteJid, instance, isGroup);
        //        chat.UpdatedAt = DateTimeOffset.UtcNow;

        //        if (isContact)
        //        {
        //            // Garante contato e vincula ao chat
        //            var contact = await _contactService.GetOrCreateContact(remoteJid, "");
        //            chat.ContactId = contact.Id;
        //        }
        //        else if (isGroup)
        //        {
        //            // Garante grupo e vincula ao chat
        //            var group = await _groupService.GetOrCreateGroup(remoteJid);
        //            chat.GroupId = group.Id;
        //        }
        //    }

        //    await _chatService.SaveChangesAsync();
        //    return Ok(new { success = true });
        //}


        //private void UpdateContactPresence(Contact contact, string? presence)
        //{
        //    contact.LastKnownPresence = presence;
        //    contact.LastPresenceAt = DateTimeOffset.UtcNow;
        //}

        //private async Task<Message?> FindMessageByExternalId(string externalId)
        //{
        //    return await _messageService
        //        .Query(m => m.ExternalId == externalId)
        //        .FirstOrDefaultAsync();
        //}

        //private void UpdateMessageStatus(Message message, MessageStatusEnum status)
        //{
        //    message.Status = status;
        //    message.UpdatedAt = DateTimeOffset.UtcNow;
        //}

        //private (bool IsContact, bool IsGroup) DetectJidType(string remoteJid)
        //{
        //    return (
        //        remoteJid.EndsWith("@s.whatsapp.net"),
        //        remoteJid.EndsWith("@g.us")
        //    );
        //}

    }
}
