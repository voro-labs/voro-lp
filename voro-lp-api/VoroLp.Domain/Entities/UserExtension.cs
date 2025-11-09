using System.ComponentModel.DataAnnotations;
using VoroLp.Domain.Entities.Identity;

namespace VoroLp.Domain.Entities
{
    public class UserExtension
    {
        [Key]
        public Guid UserId { get; set; }
        public User User { get; set; } = null!;
    }
}
