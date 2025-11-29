using System.Text.Json.Serialization;
using VoroLp.Application.DTOs.Evolution.Webhook.Base;

namespace VoroLp.Application.DTOs.Evolution.Webhook
{
    public class MessageUpdateEventDto : EvolutionEventDto<MessageUpdateDataDto>
    {
    }

    public class MessageUpdateDataDto
    {
        [JsonPropertyName("messageId")]
        public string MessageId { get; set; } = string.Empty;

        [JsonPropertyName("keyId")]
        public string KeyId { get; set; } = string.Empty;

        [JsonPropertyName("remoteJid")]
        public string RemoteJid { get; set; } = string.Empty;

        [JsonPropertyName("fromMe")]
        public bool FromMe { get; set; }

        [JsonPropertyName("participant")]
        public string Participant { get; set; } = string.Empty;

        [JsonPropertyName("instanceId")]
        public string InstanceId { get; set; } = string.Empty;

        [JsonPropertyName("status")]
        public string Status { get; set; } = string.Empty;

    }
}
