using VoroLp.Infrastructure.Factories;
using VoroLp.Shared.Utils;
using Microsoft.EntityFrameworkCore;

namespace VoroLp.API.Extensions.Configurations
{
    public static class AddDatabaseExtensions
    {
        public static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<JasmimDbContext>(options =>
                options.UseNpgsql(configuration.Get<ConfigUtil>()?.ConnectionDB));

            return services;
        }
    }
}
