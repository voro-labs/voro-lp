using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Net.Http.Json;
using System.Text.Json;
using VoroLp.Application.DTOs.Evolution.API;
using VoroLp.Application.DTOs.Request;
using VoroLp.Application.Services.Interfaces.Evolution;
using VoroLp.Domain.Entities.Evolution;
using VoroLp.Shared.Extensions;
using VoroLp.Shared.Utils;

namespace VoroLp.Application.Services.Evolution
{
    public class EvolutionService : IEvolutionService
    {
        private readonly HttpClient _httpClient;
        private readonly EvolutionUtil _evolutionUtil;
        private readonly ILogger<EvolutionService> _logger;
        private readonly IChatService _chatService;
        private readonly IGroupService _groupService;
        private readonly IContactService _contactService;
        private readonly IContactIdentifierService _contactIdentifierService;
        private readonly IInstanceService _instanceService;
        private readonly IGroupMemberService _groupMemberService;

        public EvolutionService(IHttpClientFactory httpClientFactory,
            IOptions<EvolutionUtil> evolutionUtil, ILogger<EvolutionService> logger,
            IChatService chatService, IGroupService groupService, 
            IContactService contactService, IContactIdentifierService contactIdentifierService,
            IInstanceService instanceService, IGroupMemberService groupMemberService)
        {
            _evolutionUtil = evolutionUtil.Value;
            _logger = logger;

            _chatService = chatService;
            _groupService = groupService;
            _contactService = contactService;
            _instanceService = instanceService;
            _groupMemberService = groupMemberService;
            _contactIdentifierService = contactIdentifierService;

            _httpClient = httpClientFactory.CreateClient(nameof(EvolutionService));
            _httpClient.BaseAddress = new Uri(_evolutionUtil.BaseUrl);
            _httpClient.DefaultRequestHeaders.Add("apikey", _evolutionUtil.Key);
        }

        public async Task<(Contact senderContact, Group? group, Chat chat)> CreateChatAndGroupOrContactAsync(
            string instanceName, string normalizedJid, string pushName,
            string remoteJid, bool isGroup = false, string? participant = "")
        {
            var instance = await _instanceService.GetOrCreateInstance(instanceName);

            // Chat sempre vincula ao JID NORMALIZADO
            var chat = await _chatService.GetOrCreateChat(normalizedJid, instance, isGroup);

            // -------- CONTATO DO REMETENTE ---------

            ContactIdentifier contactIdentifier;
            Group? group = null;

            if (isGroup)
            {
                // Quem realmente enviou?
                // participant sempre vem com o JID de quem enviou dentro do grupo
                var participantJid = participant; // key.Participant;

                if (string.IsNullOrWhiteSpace(participantJid))
                    participantJid = normalizedJid; // fallback improvável

                // Normalizar participant (usar identificadores caso existam)
                var partIdentifier = await _contactService.FindByAnyAsync(participantJid);
                var normalizedParticipantJid = partIdentifier?.RemoteJid ?? participantJid;

                contactIdentifier = await _contactIdentifierService
                    .GetOrCreateAsync(pushName, normalizedParticipantJid, remoteJid, "");

                await _contactService.UpdateContact(
                    contactIdentifier.Contact,
                    pushName,
                    ""
                );

                // Criar grupo
                group = await _groupService.GetOrCreateGroup("Não Informado", normalizedJid);

                // Garantir que o contato é membro do grupo
                await _groupMemberService.EnsureGroupMembership(group, contactIdentifier.Contact);
            }
            else
            {
                // Mensagem direta
                var senderJid = normalizedJid;

                // Normalizar sender
                var sendIdentifier = await _contactService.FindByAnyAsync(senderJid);
                var normalizedSenderJid = senderJid;

                contactIdentifier = await _contactIdentifierService
                    .GetOrCreateAsync(pushName, normalizedSenderJid, remoteJid);

                chat.ContactId = contactIdentifier.Contact.Id;
            }

            return (contactIdentifier.Contact, group, chat);
        }

        public async Task<IEnumerable<ContactEventDto>> GetContactsAsync()
        {
            var url = $"/chat/findContacts/{_evolutionUtil.Instance}";
            var response = await _httpClient.PostAsync(url, null);
            response.EnsureSuccessStatusCode();
            var responseContent = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<IEnumerable<ContactEventDto>>(responseContent) ?? [];
        }

        public async Task<GroupEventDto?> GetGroupAsync(string groupJId)
        {
            var url = $"/group/findGroupInfos/{_evolutionUtil.Instance}?groupJid={groupJId}";
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();
            var responseContent = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<GroupEventDto>(responseContent) ?? null;
        }

        public async Task<IEnumerable<GroupEventDto>> GetGroupsAsync()
        {
            var url = $"/group/fetchAllGroups/{_evolutionUtil.Instance}?getParticipants=false";
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();
            var responseContent = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<IEnumerable<GroupEventDto>>(responseContent) ?? [];
        }

        public async Task<InstanceEventDto> GetInstanceStatusAsync()
        {
            var url = $"/instance/connectionState/{_evolutionUtil.Instance}";
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();
            var responseContent = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<InstanceEventDto>(responseContent) ?? new InstanceEventDto();
        }

        public async Task<string> SendMessageAsync(MessageRequestDto request)
        {
            var url = $"/message/sendText/{_evolutionUtil.Instance}";
            var payload = request;
            var jsonPayload = JsonSerializer.Serialize(payload, new JsonSerializerOptions().AsDefault());
            var response = await _httpClient.PostAsync(url, new StringContent(jsonPayload, System.Text.Encoding.UTF8, "application/json"));
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadAsStringAsync();
        }

        public async Task<string> SendQuotedMessageAsync(MessageRequestDto request)
        {
            var url = $"/message/sendText/{_evolutionUtil.Instance}";
            var payload = request;
            var jsonPayload = JsonSerializer.Serialize(payload, new JsonSerializerOptions().AsDefault());
            var response = await _httpClient.PostAsync(url, new StringContent(jsonPayload, System.Text.Encoding.UTF8, "application/json"));
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadAsStringAsync();
        }

        public async Task<string> SendMediaMessageAsync(MediaRequestDto request)
        {
            var url = $"/message/sendMedia/{_evolutionUtil.Instance}";
            var payload = request;
            var jsonPayload = JsonSerializer.Serialize(payload, new JsonSerializerOptions().AsDefault());
            var response = await _httpClient.PostAsync(url, new StringContent(jsonPayload, System.Text.Encoding.UTF8, "application/json"));
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadAsStringAsync();
        }

        public async Task<string> SendLocationMessageAsync(LocationRequestDto request)
        {
            var url = $"/message/sendLocation/{_evolutionUtil.Instance}";
            var payload = request;
            var jsonPayload = JsonSerializer.Serialize(payload, new JsonSerializerOptions().AsDefault());
            var response = await _httpClient.PostAsync(url, new StringContent(jsonPayload, System.Text.Encoding.UTF8, "application/json"));
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadAsStringAsync();
        }

        public async Task<string> SendContactMessageAsync(ContactRequestDto request)
        {
            var url = $"/message/sendContact/{_evolutionUtil.Instance}";
            var payload = request;
            var jsonPayload = JsonSerializer.Serialize(payload, new JsonSerializerOptions().AsDefault());
            var response = await _httpClient.PostAsync(url, new StringContent(jsonPayload, System.Text.Encoding.UTF8, "application/json"));
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadAsStringAsync();
        }

        public async Task<string> SendReactionMessageAsync(ReactionRequestDto request)
        {
            var url = $"/message/sendReaction/{_evolutionUtil.Instance}";
            var payload = request;
            var jsonPayload = JsonSerializer.Serialize(payload, new JsonSerializerOptions().AsDefault());
            var response = await _httpClient.PostAsync(url, new StringContent(jsonPayload, System.Text.Encoding.UTF8, "application/json"));
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadAsStringAsync();
        }

        public async Task<string> DeleteMessageAsync(DeleteRequestDto request)
        {
            var url = $"/chat/deleteMessageForEveryone/{_evolutionUtil.Instance}";
            var payload = request;
            var jsonPayload = JsonSerializer.Serialize(payload, new JsonSerializerOptions().AsDefault());
            var response = await _httpClient.PostAsync(url, new StringContent(jsonPayload, System.Text.Encoding.UTF8, "application/json"));
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadAsStringAsync();
        }
    }
}
