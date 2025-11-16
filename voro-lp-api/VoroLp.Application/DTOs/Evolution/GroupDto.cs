namespace VoroLp.Application.DTOs.Evolution
{
    public class GroupDto
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string RemoteJid { get; set; } = string.Empty;

        public string Name { get; set; } = string.Empty;
        public string? ProfilePictureUrl { get; set; }

        public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
        public DateTimeOffset LastMessageAt { get; set; } = DateTimeOffset.UtcNow;

        public ICollection<GroupMemberDto> Members { get; set; } = [];
        public ICollection<MessageDto> Messages { get; set; } = [];
    }
}