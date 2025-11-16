using System.Text.Json.Serialization;

namespace VoroLp.Application.DTOs.Evolution.API
{
    public class GroupEventDto
    {
        [JsonPropertyName("id")]
        public string Id { get; set; } = string.Empty;

        [JsonPropertyName("subject")]
        public string Subject { get; set; } = string.Empty;

        [JsonPropertyName("subjectOwner")]
        public string SubjectOwner { get; set; } = string.Empty;

        [JsonPropertyName("subjectTime")]
        public long SubjectTime { get; set; }

        [JsonPropertyName("pictureUrl")]
        public string? PictureUrl { get; set; }

        [JsonPropertyName("size")]
        public int Size { get; set; }

        [JsonPropertyName("creation")]
        public long Creation { get; set; }

        [JsonPropertyName("owner")]
        public string Owner { get; set; } = string.Empty;

        [JsonPropertyName("restrict")]
        public bool Restrict { get; set; }

        [JsonPropertyName("announce")]
        public bool Announce { get; set; }

        [JsonPropertyName("isCommunity")]
        public bool IsCommunity { get; set; }

        [JsonPropertyName("isCommunityAnnounce")]
        public bool IsCommunityAnnounce { get; set; }
    }
}
