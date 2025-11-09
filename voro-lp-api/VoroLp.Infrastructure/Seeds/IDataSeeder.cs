using VoroLp.Infrastructure.Factories;

namespace VoroLp.Infrastructure.Seeds
{
    public interface IDataSeeder
    {
        Task SeedAsync(JasmimDbContext context);
    }
}