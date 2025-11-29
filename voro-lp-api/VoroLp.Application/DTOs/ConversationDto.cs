namespace VoroLp.Application.DTOs
{
    public class ConversationDto
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Number { get; set; } = string.Empty;

        public DateTimeOffset? LastMessageAt { get; set; }

        public string? LastMessage { get; set; }
    }
}
