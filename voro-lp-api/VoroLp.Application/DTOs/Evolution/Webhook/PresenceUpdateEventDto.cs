using System.Text.Json.Serialization;
using VoroLp.Application.DTOs.Evolution.Webhook.Base;

namespace VoroLp.Application.DTOs.Evolution.Webhook
{
    public class PresenceUpdateEventDto : EvolutionEventDto<PresenceUpdateDataDto>
    {
    }

    public class PresenceUpdateDataDto
    {
        [JsonPropertyName("id")]
        public string Id { get; set; } = string.Empty;

        [JsonPropertyName("presences")]
        public Dictionary<string, PresenceInfoDto> Presences { get; set; } = [];
    }

    public class PresenceInfoDto
    {
        [JsonPropertyName("lastKnownPresence")]
        public string LastKnownPresence { get; set; } = string.Empty;
    }
}
