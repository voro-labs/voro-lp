namespace VoroLp.Domain.Entities
{
    public class Contact
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string IpAddress { get; set; } = string.Empty;
        public DateTimeOffset ReceiveDate { get; set; } = DateTimeOffset.UtcNow;
    }
}
