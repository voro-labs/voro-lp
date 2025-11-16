namespace VoroLp.Domain.Entities.Evolution
{
    public class GroupMember
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid GroupId { get; set; } = Guid.NewGuid();
        public Group Group { get; set; } = null!;

        public Guid ContactId { get; set; } = Guid.NewGuid();
        public Contact Contact { get; set; } = null!;

        public DateTimeOffset JoinedAt { get; set; } = DateTime.UtcNow;
    }
}
