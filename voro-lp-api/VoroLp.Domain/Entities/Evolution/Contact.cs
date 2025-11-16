namespace VoroLp.Domain.Entities.Evolution
{
    public class Contact
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        // JID principal (normalmente o @s.whatsapp.net)
        public string RemoteJid { get; set; } = string.Empty;

        public string Number { get; set; } = string.Empty;

        public string? DisplayName { get; set; }
        public string? ProfilePictureUrl { get; set; }

        public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
        public DateTimeOffset LastMessageAt { get; set; } = DateTimeOffset.UtcNow;

        public string? LastKnownPresence { get; set; }
        public DateTimeOffset LastPresenceAt { get; set; } = DateTimeOffset.UtcNow;

        public ICollection<ContactIdentifier> Identifiers { get; set; } = [];

        public ICollection<Message> Messages { get; set; } = [];
        public ICollection<GroupMember> GroupMemberships { get; set; } = [];
    }
}
