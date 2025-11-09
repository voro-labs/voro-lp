namespace VoroLp.Application.DTOs
{
    public class UserCategoryDto
    {
        public Guid UserExtensionId { get; set; }
        public Guid CategoryId { get; set; }
        public CategoryDto Category { get; set; } = null!;
    }
}
