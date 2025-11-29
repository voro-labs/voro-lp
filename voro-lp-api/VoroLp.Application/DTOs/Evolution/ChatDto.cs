using System.Text.Json.Serialization;

namespace VoroLp.Application.DTOs.Evolution
{
    public class ChatDto
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string RemoteJid { get; set; } = string.Empty;
        public bool IsGroup { get; set; }

        public string InstanceId { get; set; } = null!;

        [JsonIgnore(Condition = JsonIgnoreCondition.Always)]
        public InstanceDto Instance { get; set; } = null!;

        public DateTimeOffset LastMessageAt { get; set; } = DateTimeOffset.UtcNow;
        public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;

        public Guid? ContactId { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.Always)]
        public ContactDto? Contact { get; set; }

        public Guid? GroupId { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.Always)]
        public GroupDto? Group { get; set; }


        [JsonIgnore(Condition = JsonIgnoreCondition.Always)]
        public ICollection<MessageDto> Messages { get; set; } = [];
    }
}