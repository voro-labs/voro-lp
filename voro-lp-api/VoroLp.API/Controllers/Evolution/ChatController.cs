using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Text.Json;
using VoroLp.API.Extensions;
using VoroLp.API.ViewModels;
using VoroLp.Application.DTOs.Evolution;
using VoroLp.Application.DTOs.Evolution.Webhook;
using VoroLp.Application.DTOs.Request;
using VoroLp.Application.Services.Evolution;
using VoroLp.Application.Services.Interfaces.Evolution;
using VoroLp.Domain.Entities.Evolution;
using VoroLp.Domain.Enums;

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
        public async Task<IActionResult> ContactSave([FromBody] ContactRequestDto request)
        {
            try
            {
                var (senderContact, group, chat) = await _evolutionService.CreateChatAndGroupOrContactAsync(
                    request.InstanceName, $"{request.Number}@s.whatsapp.net",
                    $"{request.Name}", $"{request.Number}@s.whatsapp.net", false, string.Empty);

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

        // ======================================================
        // GET → Mensagens de um contato
        // ======================================================
        [HttpGet("messages/{contactId:guid}")]
        public async Task<IActionResult> GetMessages(Guid contactId)
        {
            try
            {
                var messages = await _messageService.Query(m => m.ContactId == contactId)
                    .Include(m => m.Reactions)
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

                if (string.IsNullOrWhiteSpace(request.Content))
                    return BadRequest("Mensagem não pode ser vazia.");

                // EvolutionService retorna STRING → ajustado
                var responseString = await _evolutionService.SendMessageAsync(contact.Number, request);

                var response = JsonSerializer.Deserialize<MessageUpsertDataDto>(responseString);

                var messageDto = new MessageDto()
                {
                    ChatId = chat.Id,
                    ContactId = contact.Id,
                    Content = $"{response?.Message.Conversation}",
                    ExternalId = Guid.NewGuid().ToString(),
                    IsFromMe = true,
                    RawJson = responseString,
                    RemoteFrom = "",
                    RemoteTo = contact.RemoteJid,
                    SentAt = DateTimeOffset.UtcNow,
                    Status = MessageStatusEnum.Sent,
                    Type = MessageTypeEnum.Text
                };

                await _messageService.AddAsync(messageDto);

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
    }
}
