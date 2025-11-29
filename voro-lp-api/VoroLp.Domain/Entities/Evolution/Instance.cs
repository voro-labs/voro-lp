namespace VoroLp.Domain.Entities.Evolution
{
    public class Instance
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;

        public ICollection<Chat> Chats { get; set; } = [];
    }
}
