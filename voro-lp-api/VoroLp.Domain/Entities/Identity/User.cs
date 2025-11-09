using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace VoroLp.Domain.Entities.Identity
{
    public class User : IdentityUser<Guid>
    {

        [StringLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [StringLength(100)]
        public string LastName { get; set; } = string.Empty;

        [StringLength(3)]
        public string? CountryCode { get; set; }

        public DateTimeOffset? BirthDate { get; set; }

        public DateTimeOffset CreatedAt { get; set; } = DateTime.UtcNow;

        public bool IsActive { get; set; }

        public UserExtension UserExtension { get; set; } = null!;
        public ICollection<UserRole> UserRoles { get; set; } = [];
    }
}
