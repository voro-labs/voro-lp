namespace VoroLp.Application.DTOs
{
    public class CategoryDto
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public bool IsDefault { get; set; } = false;


        // Relacionamento com usuários (se categoria for pessoal)
        public ICollection<UserCategoryDto> UserCategories { get; set; } = [];
    }
}
