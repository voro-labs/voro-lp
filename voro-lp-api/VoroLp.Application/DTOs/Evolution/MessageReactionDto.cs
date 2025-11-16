using VoroLp.Domain.Entities.Evolution;

namespace VoroLp.Application.DTOs.Evolution
{
    public class MessageReactionDto
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        // A reação em si, ex: "❤️", "👍"
        public string Reaction { get; set; } = string.Empty;

        // Quem enviou a reação
        public Guid? ContactId { get; set; }
        public Contact? Contact { get; set; }

        // Quando a reação foi enviada
        public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

        // A mensagem relacionada
        public Guid MessageId { get; set; }
        public MessageDto Message { get; set; } = null!;
    }
}
