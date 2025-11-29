namespace VoroLp.Domain.Entities.Evolution
{
    public class ContactIdentifier
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid ContactId { get; set; }
        public Contact Contact { get; set; } = null!;

        public string Jid { get; set; } = string.Empty;
        public bool IsPrimary { get; set; } = false;
    }
}
