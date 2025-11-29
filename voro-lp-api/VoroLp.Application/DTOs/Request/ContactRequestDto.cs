using Microsoft.AspNetCore.Http;

namespace VoroLp.Application.DTOs.Request
{
    public class ContactRequestDto
    {
        public string Number { get; set; } = string.Empty;
        public ContactInfoRequestDto Contact { get; set; } = null!;
    }

    public class ContactInfoRequestDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Wuid { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Organization { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
    }
}
