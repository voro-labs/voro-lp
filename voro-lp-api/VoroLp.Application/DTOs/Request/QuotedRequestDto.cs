namespace VoroLp.Application.DTOs.Request
{
    public class QuotedRequestDto
    {
        public QuotedKeyRequestDto Key { get; set; } = null!;
    }

    public class QuotedKeyRequestDto
    {
        public string Id { get; set; } = string.Empty;
    }
}
