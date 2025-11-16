namespace VoroLp.Application.DTOs.Request
{
    public class ContactRequestDto
    {
        public string Name { get; set; } = string.Empty;
        public string Number { get; set; } = string.Empty;
        public string InstanceName { get; set; } = "voro-evolution";
    }
}
