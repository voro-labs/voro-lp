using System.Text.Json.Serialization;

namespace VoroLp.Application.DTOs.Evolution
{
    public class GroupDto
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string RemoteJid { get; set; } = string.Empty;

        public string Name { get; set; } = string.Empty;
        public string? ProfilePictureUrl { get; set; }

        public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

        public string LastMessage { get; set; } = string.Empty;
        public bool LastMessageFromMe { get; set; }
        public DateTimeOffset LastMessageAt { get; set; } = DateTimeOffset.UtcNow;


        [JsonIgnore(Condition = JsonIgnoreCondition.Always)]
        public ICollection<GroupMemberDto> Members { get; set; } = [];
        
        [JsonIgnore(Condition = JsonIgnoreCondition.Always)]
        public ICollection<MessageDto> Messages { get; set; } = [];
    }
}