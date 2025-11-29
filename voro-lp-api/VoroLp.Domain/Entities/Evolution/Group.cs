namespace VoroLp.Domain.Entities.Evolution
{
    public class Group
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string RemoteJid { get; set; } = string.Empty;

        public string Name { get; set; } = string.Empty;
        public string? ProfilePictureUrl { get; set; }

        public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

        public string LastMessage { get; set; } = string.Empty;
        public bool LastMessageFromMe { get; set; }
        public DateTimeOffset LastMessageAt { get; set; } = DateTimeOffset.UtcNow;

        public ICollection<GroupMember> Members { get; set; } = [];
        public ICollection<Message> Messages { get; set; } = [];
    }
}
