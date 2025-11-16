namespace VoroLp.Application.DTOs.Evolution.API
{
    public class MessageEventDto
    {
        public Guid Id { get; set; }
        public string From { get; set; } = string.Empty;
        public string To { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTimeOffset SentAt { get; set; }
        public bool IsFromMe { get; set; }

        public Guid ContactId { get; set; }
        public ContactEventDto Contact { get; set; } = default!;
    }
}
