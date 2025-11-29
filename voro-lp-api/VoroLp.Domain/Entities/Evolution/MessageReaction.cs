namespace VoroLp.Domain.Entities.Evolution
{
    public class MessageReaction
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        // A reação em si, ex: "❤️", "👍"
        public string Reaction { get; set; } = string.Empty;

        // Quem enviou a reação
        public string RemoteFrom { get; set; } = string.Empty;

        // Quem recebeu a reação
        public string RemoteTo { get; set; } = string.Empty;

        public bool IsFromMe { get; set; }

        // Quando a reação foi enviada
        public DateTimeOffset SentAt { get; set; } = DateTimeOffset.UtcNow;

        // Quem recebeu a reação
        public Guid? ContactId { get; set; }
        public Contact? Contact { get; set; }

        // A mensagem relacionada
        public Guid MessageId { get; set; }
        public Message Message { get; set; } = null!;
    }
}
