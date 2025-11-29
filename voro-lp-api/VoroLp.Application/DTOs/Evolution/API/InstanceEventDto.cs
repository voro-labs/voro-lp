namespace VoroLp.Application.DTOs.Evolution.API
{
    public class InstanceEventDto
    {
        public InstanceDetailDto Instance { get; set; } = null!;
    }

    public class InstanceDetailDto
    {
        public string InstanceName { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
    }
}
