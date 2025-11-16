using System.Text.Json.Serialization;

namespace VoroLp.Application.DTOs.Evolution.API
{
    public class ContactEventDto
    {
        [JsonPropertyName("id")]
        public string Id { get; set; } = string.Empty;
        
        [JsonPropertyName("remoteJid")]
        public string RemoteJid { get; set; } = string.Empty;

        [JsonPropertyName("pushName")]
        public string PushName { get; set; } = string.Empty;

        [JsonPropertyName("profilePicUrl")]
        public string ProfilePicUrl { get; set; } = string.Empty;

        [JsonPropertyName("createdAt")]
        public string CreatedAt { get; set; } = string.Empty;

        [JsonPropertyName("updatedAt")]
        public string UpdatedAt { get; set; } = string.Empty;

        [JsonPropertyName("instanceId")]
        public string InstanceId { get; set; } = string.Empty;
    }
}
