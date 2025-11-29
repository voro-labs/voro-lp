namespace VoroLp.Application.DTOs.Request
{
    public class DeleteRequestDto
    {
        public string RemoteJid { get; set; } = string.Empty;
        public bool FromMe { get; set; } = true;
        public string Id { get; set; } = string.Empty;
    }
}
