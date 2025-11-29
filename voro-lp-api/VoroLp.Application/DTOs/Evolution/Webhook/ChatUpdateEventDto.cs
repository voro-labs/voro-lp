using System.Text.Json.Serialization;
using VoroLp.Application.DTOs.Evolution.Webhook.Base;

namespace VoroLp.Application.DTOs.Evolution.Webhook
{
    public class ChatUpdateEventDto : EvolutionEventDto<List<ChatUpdateDataDto>>
    {
    }

    public class ChatUpdateDataDto
    {
        [JsonPropertyName("remoteJid")]
        public string RemoteJid { get; set; } = string.Empty;
        
        [JsonPropertyName("instanceId")]
        public string InstanceId { get; set; } = string.Empty;
    }
}
