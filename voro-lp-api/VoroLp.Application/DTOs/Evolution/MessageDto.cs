using System.Text.Json.Serialization;
using VoroLp.Domain.Enums;

namespace VoroLp.Application.DTOs.Evolution
{
    public class MessageDto
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public string ExternalId { get; set; } = string.Empty;
        public string RemoteFrom { get; set; } = string.Empty;
        public string RemoteTo { get; set; } = string.Empty;

        public string Content { get; set; } = string.Empty;
        public string Base64 { get; set; } = string.Empty;
        public string? RawJson { get; set; }

        public DateTimeOffset SentAt { get; set; } = DateTimeOffset.UtcNow;
        public bool IsFromMe { get; set; }

        public MessageStatusEnum Status { get; set; } = MessageStatusEnum.Created;
        public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;

        public MessageTypeEnum Type { get; set; } = MessageTypeEnum.Text;

        public string? MimeType { get; set; }
        public string? FileUrl { get; set; }
        public long? FileLength { get; set; }
        public int? Width { get; set; }
        public int? Height { get; set; }
        public int? DurationSeconds { get; set; }
        public byte[]? Thumbnail { get; set; }

        public Guid? ContactId { get; set; }
        public ContactDto? Contact { get; set; }

        public Guid? GroupId { get; set; }
        public GroupDto? Group { get; set; }

        public Guid ChatId { get; set; }
        public ChatDto Chat { get; set; } = null!;

        public Guid? QuotedMessageId { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public MessageDto? QuotedMessage { get; set; }
        
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public ICollection<MessageReactionDto> MessageReactions { get; set; } = [];
    }
}