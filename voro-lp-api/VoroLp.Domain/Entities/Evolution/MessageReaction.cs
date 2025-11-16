using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VoroLp.Domain.Entities.Evolution
{
    public class MessageReaction
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
        public Message Message { get; set; } = null!;
    }
}
