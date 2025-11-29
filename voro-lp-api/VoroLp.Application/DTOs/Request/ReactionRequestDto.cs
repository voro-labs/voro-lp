namespace VoroLp.Application.DTOs.Request
{
    public class ReactionRequestDto
    {
        public ReactionKeyRequestDto Key { get; set; } = null!;
        public string Reaction { get; set; } = string.Empty;
    }

    public class ReactionKeyRequestDto
    {
        public string RemoteJid { get; set; } = string.Empty;
        public bool FromMe { get; set; } = true;
        public string Id { get; set; } = string.Empty;
    }
}
