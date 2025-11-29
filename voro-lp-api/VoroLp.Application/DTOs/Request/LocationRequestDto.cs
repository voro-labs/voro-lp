namespace VoroLp.Application.DTOs.Request
{
    public class LocationRequestDto
    {
        public string Number { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public long Latitude { get; set; }
        public long Longitude { get; set; }
        public QuotedRequestDto Quoted { get; set; } = null!;
    }
}
