using System.Text.Json.Serialization;
using VoroLp.Application.DTOs.Evolution.Webhook.Base;

namespace VoroLp.Application.DTOs.Evolution.Webhook
{
    public class ContactUpdateEventDto : EvolutionEventDto<ContactUpdateDataDto>
    {
    }

    public class ContactsUpdateEventDto : EvolutionEventDto<List<ContactUpdateDataDto>>
    {
    }

    public class ContactUpdateDataDto
    {
        [JsonPropertyName("remoteJid")]
        public string RemoteJid { get; set; } = string.Empty;

        [JsonPropertyName("pushName")]
        public string PushName { get; set; } = string.Empty;

        [JsonPropertyName("profilePicUrl")]
        public string ProfilePicUrl { get; set; } = string.Empty;

        [JsonPropertyName("instanceId")]
        public string InstanceId { get; set; } = string.Empty;
    }

}
