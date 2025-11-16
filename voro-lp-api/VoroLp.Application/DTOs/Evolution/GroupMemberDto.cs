namespace VoroLp.Application.DTOs.Evolution
{
    public class GroupMemberDto
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid GroupId { get; set; } = Guid.NewGuid();
        public GroupDto Group { get; set; } = null!;

        public Guid ContactId { get; set; } = Guid.NewGuid();
        public ContactDto Contact { get; set; } = null!;

        public DateTimeOffset JoinedAt { get; set; } = DateTime.UtcNow;
    }
}