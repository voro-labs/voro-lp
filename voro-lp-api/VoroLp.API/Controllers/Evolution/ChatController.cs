using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using VoroLp.API.Extensions;
using VoroLp.API.ViewModels;
using VoroLp.Application.DTOs;
using VoroLp.Application.DTOs.Evolution;
using VoroLp.Application.DTOs.Evolution.Webhook;
using VoroLp.Application.DTOs.Request;
using VoroLp.Application.Services.Interfaces.Evolution;
using VoroLp.Domain.Entities.Evolution;
using VoroLp.Domain.Enums;
using VoroLp.Shared.Extensions;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace VoroLp.API.Controllers.Evolution
{
    [Route("api/v{version:version}/[controller]")]
    [Tags("Evolution")]
    [ApiController]
    [Authorize]
    public class ChatController(
        IChatService chatService,
        IGroupService groupService,
        IMessageService messageService,
        IContactService contactService,
        IEvolutionService evolutionService,
        IInstanceService instanceService,
        IGroupMemberService groupMemberService,
        IMessageReactionService messageReactionService,
        IContactIdentifierService contactIdentifierService,
        IMapper mapper) : ControllerBase
    {
        private readonly IChatService _chatService = chatService;
        private readonly IGroupService _groupService = groupService;
        private readonly IContactService _contactService = contactService;
        private readonly IMessageService _messageService = messageService;
        private readonly IEvolutionService _evolutionService = evolutionService;
        private readonly IInstanceService _instanceService = instanceService;
        private readonly IGroupMemberService _groupMemberService = groupMemberService;
        private readonly IMessageReactionService _messageReactionService = messageReactionService;
        private readonly IContactIdentifierService _contactIdentifierService = contactIdentifierService;
        private readonly IMapper _mapper = mapper;

        // ======================================================
        // GET → Conversas unificadas (contatos + grupos)
        // ======================================================
        [HttpGet("contacts")]
        public async Task<IActionResult> GetContacts()
        {
            try
            {
                // contatos (privado)
                var contacts = await _contactService.Query(c => !c.GroupMemberships.Any())
                    .Include(item => item.Messages)
                    .OrderByDescending(c => c.LastMessageAt)
                    .ToListAsync();

                //contacts
                //    LastMessage = c.Messages
                //            .OrderByDescending(m => m.SentAt)
                //            .Select(m => m.Content)
                //            .FirstOrDefault()

                //// grupos (conversas de grupo)
                //var groups = await _groupService.Query()
                //    .OrderByDescending(c => c.LastMessageAt)
                //    .Select(c => new ConversationDto
                //    {
                //        Id = c.Id,
                //        Name = c.Name,
                //        Number = c.RemoteJid,
                //        LastMessageAt = c.LastMessageAt,
                //        LastMessage = c.Messages
                //            .OrderByDescending(m => m.SentAt)
                //            .Select(m => m.Content)
                //            .FirstOrDefault()
                //    })
                //    .ToListAsync();

                //var result = contacts.Concat(groups).ToList();

                var contactsDtos = _mapper.Map<IEnumerable<ContactDto>>(contacts);

                return ResponseViewModel<IEnumerable<ContactDto>>
                    .Success(contactsDtos)
                    .ToActionResult();
            }
            catch (Exception ex)
            {
                return ResponseViewModel<IEnumerable<ContactDto>>
                    .Fail(ex.Message)
                    .ToActionResult();
            }
        }

        // ======================================================
        // POST → Enviar mensagem
        // ======================================================
        [HttpPost("contacts/save")]
        public async Task<IActionResult> ContactSave([FromBody] ContactDto request)
        {
            try
            {
                var (senderContact, group, chat) = await _evolutionService.CreateChatAndGroupOrContactAsync(
                    $"{request.InstanceName}", $"{request.Number}@s.whatsapp.net",
                    $"{request.DisplayName}", $"{request.Number}@s.whatsapp.net", false, string.Empty);

                if (senderContact != null)
                    _contactService.Update(senderContact);

                _chatService.Update(chat);

                await _contactService.SaveChangesAsync();
                await _chatService.SaveChangesAsync();

                if (senderContact == null)
                    return ResponseViewModel<ContactDto>
                        .Fail("Contato não foi cadastrado")
                        .ToActionResult();

                var contactDto = _mapper.Map<ContactDto>(senderContact);

                return ResponseViewModel<ContactDto>
                    .Success(contactDto)
                    .ToActionResult();
            }
            catch (Exception ex)
            {
                return ResponseViewModel<ContactDto>
                    .Fail(ex.Message)
                    .ToActionResult();
            }
        }

        [HttpPut("contacts/{contactId:guid}/update")]
        public async Task<IActionResult> ContactUpdate(Guid contactId, [FromForm] ContactDto request)
        {
            try
            {
                var senderContact = await _contactService.Query(c => c.Id == contactId).FirstOrDefaultAsync();

                if (senderContact == null)
                    return ResponseViewModel<ContactDto>
                        .Fail("Contato não foi cadastrado")
                        .ToActionResult();

                var profilePicture = "";

                if (request.ProfilePicture != null)
                {
                    var media = new MediaDto(request.ProfilePicture);

                    if (media.MediaStream != null)
                    {
                        string? mediaBase64 = await media.MediaStream.ToBase64Async();

                        profilePicture = $"data:{media.Mimetype};base64,{mediaBase64}";
                    }
                }
                    

                await _contactService.UpdateContact(senderContact, request.DisplayName, profilePicture);

                await _contactService.SaveChangesAsync();

                var contactDto = _mapper.Map<ContactDto>(senderContact);

                return ResponseViewModel<ContactDto>
                    .Success(contactDto)
                    .ToActionResult();
            }
            catch (Exception ex)
            {
                return ResponseViewModel<ContactDto>
                    .Fail(ex.Message)
                    .ToActionResult();
            }
        }

        // ======================================================
        // GET → Mensagens de um contato
        // ======================================================
        [HttpGet("messages/{contactId:guid}")]
        public async Task<IActionResult> GetMessages(Guid contactId)
        {
            try
            {
                var messages = await _messageService
                    .Query(m => 
                        m.ContactId == contactId &&
                        m.Status != MessageStatusEnum.Deleted)
                    .Include(m => m.QuotedMessage)
                        .ThenInclude(q => q!.Contact)
                    .Include(m => m.MessageReactions)
                    .OrderBy(m => m.SentAt)
                    .ToListAsync();

                var messagesDtos = _mapper.Map<IEnumerable<MessageDto>>(messages);

                return ResponseViewModel<IEnumerable<MessageDto>>
                    .Success(messagesDtos)
                    .ToActionResult();
            }
            catch (Exception ex)
            {
                return ResponseViewModel<IEnumerable<MessageDto>>
                    .Fail(ex.Message)
                    .ToActionResult();
            }
        }

        // ======================================================
        // POST → Enviar mensagem
        // ======================================================
        [HttpPost("messages/{contactId:guid}/send")]
        public async Task<IActionResult> SendMessage(Guid contactId, [FromBody] MessageRequestDto request)
        {
            try
            {
                var contact = await _contactService.Query(c => c.Id == contactId).FirstOrDefaultAsync();

                var chat = await _chatService.Query(chat => chat.ContactId == contactId).FirstOrDefaultAsync();

                if (chat == null)
                    return NoContent();

                if (contact == null)
                    return BadRequest("Contato não encontrado!");

                if (string.IsNullOrWhiteSpace(contact.Number))
                    return BadRequest("Contato não possui número cadastrado.");

                if (string.IsNullOrWhiteSpace(request.Conversation))
                    return BadRequest("Mensagem não pode ser vazia.");

                request.Number = contact.Number;

                // EvolutionService retorna STRING → ajustado
                var responseString = await _evolutionService.SendMessageAsync(request);

                var response = JsonSerializer.Deserialize<MessageUpsertDataDto>(responseString);

                var messageDto = new MessageDto()
                {
                    ChatId = chat.Id,
                    ContactId = contact.Id,
                    Content = $"{response?.Message.Conversation}",
                    ExternalId = $"{response?.Key.Id}",
                    IsFromMe = true,
                    RawJson = responseString,
                    RemoteFrom = "",
                    RemoteTo = contact.RemoteJid,
                    SentAt = DateTimeOffset.UtcNow,
                    Status = MessageStatusEnum.Sent,
                    Type = MessageTypeEnum.Text
                };

                await _messageService.AddAsync(messageDto);

                contact.LastMessage = messageDto.Content;

                contact.LastMessageFromMe = true;

                contact.LastMessageAt = DateTimeOffset.UtcNow;
                
                _contactService.Update(contact);

                await _messageService.SaveChangesAsync();
                
                await _contactService.SaveChangesAsync();

                return ResponseViewModel<MessageDto>
                    .Success(messageDto)
                    .ToActionResult();
            }
            catch (Exception ex)
            {
                return ResponseViewModel<MessageDto>
                    .Fail(ex.Message)
                    .ToActionResult();
            }
        }

        // ======================================================
        // POST → Enviar resposta para mensagem
        // ======================================================
        [HttpPost("messages/{contactId:guid}/send/quoted")]
        public async Task<IActionResult> SendQuoted(Guid contactId, [FromBody] MessageRequestDto request)
        {
            try
            {
                var contact = await _contactService.Query(c => c.Id == contactId).FirstOrDefaultAsync();

                var chat = await _chatService.Query(chat => chat.ContactId == contactId).FirstOrDefaultAsync();

                _ = Guid.TryParse(request.Quoted?.Key.Id, out var guid);

                var message = await _messageService.Query(m => m.Id == guid && m.ContactId == contactId).FirstOrDefaultAsync();

                if (chat == null)
                    return NoContent();

                if (message == null)
                    return NoContent();

                if (contact == null)
                    return BadRequest("Contato não encontrado!");

                if (string.IsNullOrWhiteSpace(contact.Number))
                    return BadRequest("Contato não possui número cadastrado.");

                if (string.IsNullOrWhiteSpace(request.Conversation))
                    return BadRequest("Mensagem não pode ser vazia.");

                request.Number = contact.Number;

                if (request.Quoted != null)
                    request.Quoted.Key.Id = message.ExternalId;

                // EvolutionService retorna STRING → ajustado
                var responseString = await _evolutionService.SendQuotedMessageAsync(request);

                var response = JsonSerializer.Deserialize<MessageUpsertDataDto>(responseString);

                var messageDto = new MessageDto()
                {
                    ChatId = chat.Id,
                    ContactId = contact.Id,
                    Content = $"{response?.Message.Conversation}",
                    ExternalId = $"{response?.Key.Id}",
                    IsFromMe = true,
                    RawJson = responseString,
                    RemoteFrom = "",
                    RemoteTo = contact.RemoteJid,
                    SentAt = DateTimeOffset.UtcNow,
                    Status = MessageStatusEnum.Sent,
                    Type = MessageTypeEnum.Text,
                    QuotedMessageId = message.Id
                };

                await _messageService.AddAsync(messageDto);

                contact.LastMessage = messageDto.Content;

                contact.LastMessageFromMe = true;

                contact.LastMessageAt = DateTimeOffset.UtcNow;
                
                _contactService.Update(contact);

                await _messageService.SaveChangesAsync();
                
                await _contactService.SaveChangesAsync();

                messageDto.QuotedMessage = _mapper.Map<MessageDto>(message);

                return ResponseViewModel<MessageDto>
                    .Success(messageDto)
                    .ToActionResult();
            }
            catch (Exception ex)
            {
                return ResponseViewModel<MessageDto>
                    .Fail(ex.Message)
                    .ToActionResult();
            }
        }

        // ======================================================
        // POST → Enviar resposta para mensagem
        // ======================================================
        [HttpPost("messages/{contactId:guid}/send/attachment")]
        public async Task<IActionResult> SendAttachment(Guid contactId, [FromForm] MediaDto request)
        {
            try
            {
                var contact = await _contactService.Query(c => c.Id == contactId).FirstOrDefaultAsync();

                var chat = await _chatService.Query(chat => chat.ContactId == contactId).FirstOrDefaultAsync();

                if (chat == null)
                    return NoContent();

                if (contact == null)
                    return BadRequest("Contato não encontrado!");

                if (string.IsNullOrWhiteSpace(contact.Number))
                    return BadRequest("Contato não possui número cadastrado.");

                if (request.Attachment == null)
                    return BadRequest("Anexo não pode ser nulo.");

                MediaRequestDto? mediaRequest = null;

                if (request.MediaStream != null)
                {
                    string? mediaBase64 = await request.MediaStream.ToBase64Async();

                    mediaRequest = new MediaRequestDto(contact.RemoteJid, "", $"{mediaBase64}", request);
                }

                if (mediaRequest == null)
                    return BadRequest("Anexo não pode ser nulo.");

                // EvolutionService retorna STRING → ajustado
                var responseString = await _evolutionService.SendMediaMessageAsync(mediaRequest);

                var response = JsonSerializer.Deserialize<MessageUpsertDataDto>(responseString);

                if (response == null)
                    return BadRequest("Erro ao enviar anexo.");

                string? fileUrl = string.Empty;
                string? content = string.Empty;
                string? base64 = string.Empty;
                MessageTypeEnum messageType = response.MessageType switch
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

                if (messageType == MessageTypeEnum.Image)
                {
                    base64 = mediaRequest.Media ?? string.Empty;
                    mimeType = response.Message?.ImageMessage?.MimeType;
                    fileLength = response.Message?.ImageMessage?.FileLength?.High ?? response.Message?.ImageMessage?.FileLength?.Low ?? 0;
                    width = response.Message?.ImageMessage?.Width;
                    height = response.Message?.ImageMessage?.Height;
                    thumbnail = response.Message?.ImageMessage?.JpegThumbnail;
                    fileUrl = response.Message?.ImageMessage?.Url;
                }
                else if (messageType == MessageTypeEnum.Video)
                {
                    base64 = mediaRequest.Media ?? string.Empty;
                    mimeType = response.Message?.VideoMessage?.MimeType;
                    fileLength = response.Message?.VideoMessage?.FileLength?.High ?? response.Message?.VideoMessage?.FileLength?.Low ?? 0;
                    width = response.Message?.VideoMessage?.Width;
                    height = response.Message?.VideoMessage?.Height;
                    durationSeconds = response.Message?.VideoMessage?.Seconds;
                    thumbnail = response.Message?.VideoMessage?.JpegThumbnail;
                    fileUrl = response.Message?.VideoMessage?.Url;
                }

                var messageDto = new MessageDto()
                {
                    ChatId = chat.Id,
                    ContactId = contact.Id,
                    Content = $"{response?.Message?.Conversation}",
                    Base64 = base64,
                    ExternalId = $"{response?.Key.Id}",
                    IsFromMe = true,
                    RawJson = responseString,
                    RemoteFrom = "",
                    RemoteTo = contact.RemoteJid,
                    SentAt = DateTimeOffset.UtcNow,
                    Status = MessageStatusEnum.Sent,
                    Type = messageType,
                    FileUrl = fileUrl,
                    MimeType = mimeType,
                    FileLength = fileLength,
                    Width = width,
                    Height = height,
                    DurationSeconds = durationSeconds,
                    Thumbnail = thumbnail
                };

                await _messageService.AddAsync(messageDto);

                contact.LastMessage = "Enviou um arquivo";

                contact.LastMessageFromMe = true;

                contact.LastMessageAt = DateTimeOffset.UtcNow;
                
                _contactService.Update(contact);

                await _messageService.SaveChangesAsync();
                
                await _contactService.SaveChangesAsync();

                return ResponseViewModel<MessageDto>
                    .Success(messageDto)
                    .ToActionResult();
            }
            catch (Exception ex)
            {
                return ResponseViewModel<MessageDto>
                    .Fail(ex.Message)
                    .ToActionResult();
            }
        }

        // ======================================================
        // POST → Enviar reação para mensagem
        // ======================================================
        [HttpPost("messages/{contactId:guid}/send/reaction")]
        public async Task<IActionResult> SendReaction(Guid contactId, [FromBody] ReactionRequestDto request)
        {
            try
            {
                var contact = await _contactService.Query(c => c.Id == contactId).FirstOrDefaultAsync();

                var chat = await _chatService.Query(chat => chat.ContactId == contactId).FirstOrDefaultAsync();

                _ = Guid.TryParse(request.Key.Id, out var guid);

                var message = await _messageService.Query(m => m.Id == guid && m.ContactId == contactId)
                    .Include(m => m.MessageReactions)
                    .FirstOrDefaultAsync();

                if (chat == null)
                    return NoContent();

                if (message == null)
                    return NoContent();

                if (contact == null)
                    return BadRequest("Contato não encontrado!");

                if (string.IsNullOrWhiteSpace(contact.Number))
                    return BadRequest("Contato não possui número cadastrado.");

                if (string.IsNullOrWhiteSpace(request.Reaction))
                    return BadRequest("Mensagem não pode ser vazia.");

                request.Key.RemoteJid = contact.RemoteJid;

                request.Key.FromMe = true;

                request.Key.Id = message.ExternalId;

                // EvolutionService retorna STRING → ajustado
                var responseString = await _evolutionService.SendReactionMessageAsync(request);

                var response = JsonSerializer.Deserialize<MessageUpsertDataDto>(responseString);

                _messageReactionService.DeleteRange(message.MessageReactions.Where(item => item.IsFromMe));

                await _messageReactionService.SaveChangesAsync();

                var messageReaction = new MessageReactionDto()
                {
                    RemoteFrom = "",
                    RemoteTo = $"{contact.RemoteJid}",
                    ContactId = contact.Id,
                    MessageId = message.Id,
                    Reaction = request.Reaction,
                    IsFromMe = request.Key.FromMe
                };

                await _messageReactionService.AddAsync(messageReaction);

                contact.LastMessage = $"Você reagiu com {request.Reaction}";

                contact.LastMessageFromMe = request.Key.FromMe;

                contact.LastMessageAt = DateTimeOffset.UtcNow;

                _contactService.Update(contact);

                await _messageReactionService.SaveChangesAsync();

                await _contactService.SaveChangesAsync();

                return ResponseViewModel<object>
                    .Success(null)
                    .ToActionResult();
            }
            catch (Exception ex)
            {
                return ResponseViewModel<object>
                    .Fail(ex.Message)
                    .ToActionResult();
            }
        }

        // ======================================================
        // POST → Deleta a mensagem
        // ======================================================
        [HttpPost("messages/{contactId:guid}/delete")]
        public async Task<IActionResult> DeleteMessage(Guid contactId, [FromBody] DeleteRequestDto request)
        {
            try
            {
                var contact = await _contactService.Query(c => c.Id == contactId).FirstOrDefaultAsync();

                var chat = await _chatService.Query(chat => chat.ContactId == contactId).FirstOrDefaultAsync();

                _ = Guid.TryParse(request.Id, out var guid);

                var message = await _messageService.Query(m => m.Id == guid && m.ContactId == contactId).FirstOrDefaultAsync();

                if (chat == null)
                    return NoContent();

                if (message == null)
                    return NoContent();

                if (contact == null)
                    return BadRequest("Contato não encontrado!");

                if (string.IsNullOrWhiteSpace(contact.Number))
                    return BadRequest("Contato não possui número cadastrado.");

                request.RemoteJid = contact.RemoteJid;

                request.FromMe = true;

                request.Id = message.ExternalId;

                // EvolutionService retorna STRING → ajustado
                var responseString = await _evolutionService.DeleteMessageAsync(request);

                var response = JsonSerializer.Deserialize<MessageUpsertDataDto>(responseString);

                message.Status = MessageStatusEnum.Deleted;

                _messageService.Update(message);

                await _messageService.SaveChangesAsync();
                
                return ResponseViewModel<object>
                    .Success(null)
                    .ToActionResult();
            }
            catch (Exception ex)
            {
                return ResponseViewModel<object>
                    .Fail(ex.Message)
                    .ToActionResult();
            }
        }

        // ======================================================
        // POST → Encaminha a mensagem
        // ======================================================
        [HttpPost("messages/{contactId:guid}/forward")]
        public async Task<IActionResult> ForwardMessage(Guid contactId, [FromBody] ForwardRequestDto request)
        {
            try
            {
                var contact = await _contactService.Query(c => c.Id == contactId).FirstOrDefaultAsync();

                var chat = await _chatService.Query(chat => chat.ContactId == contactId).FirstOrDefaultAsync();

                _ = Guid.TryParse(request.Id, out var guid);

                var message = await _messageService.Query(m => m.Id == guid).FirstOrDefaultAsync();

                if (chat == null)
                    return NoContent();

                if (message == null)
                    return NoContent();

                if (contact == null)
                    return BadRequest("Contato não encontrado!");

                if (string.IsNullOrWhiteSpace(contact.Number))
                    return BadRequest("Contato não possui número cadastrado.");

                request.RemoteJid = contact.RemoteJid;

                request.FromMe = true;

                request.Id = message.ExternalId;

                string conversation = message.Content;

                if (!message.IsFromMe)
                  conversation = $"""
                    Mensagem de {contact.DisplayName}:
                    Conteúdo: {message.Content}
                  """;

                var messageRequest = new MessageRequestDto
                {
                    Number = contact.Number,
                    Conversation = conversation
                };

                // EvolutionService retorna STRING → ajustado
                var responseString = await _evolutionService.SendMessageAsync(messageRequest);

                var response = JsonSerializer.Deserialize<MessageUpsertDataDto>(responseString);

                message.Status = MessageStatusEnum.Deleted;

                _messageService.Update(message);

                await _messageService.SaveChangesAsync();
                
                return ResponseViewModel<object>
                    .Success(null)
                    .ToActionResult();
            }
            catch (Exception ex)
            {
                return ResponseViewModel<object>
                    .Fail(ex.Message)
                    .ToActionResult();
            }
        }
    }
}
