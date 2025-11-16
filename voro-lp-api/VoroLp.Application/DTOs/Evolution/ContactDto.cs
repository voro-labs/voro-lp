namespace VoroLp.Application.DTOs.Evolution
{
    public class ContactDto
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string RemoteJid { get; set; } = string.Empty;
        public string Number { get; set; } = string.Empty;

        public string? DisplayName { get; set; }
        public string? ProfilePictureUrl { get; set; }

        public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;

        public DateTimeOffset LastMessageAt { get; set; } = DateTimeOffset.UtcNow;
        public string LastMessage { get; set; } = string.Empty;
        public int Unread { get; set; } = 0;

        public string? LastKnownPresence { get; set; }
        public DateTimeOffset LastPresenceAt { get; set; } = DateTimeOffset.UtcNow;

        public ICollection<MessageDto> Messages { get; set; } = [];
        public ICollection<GroupMemberDto> GroupMemberships { get; set; } = [];
    }
}