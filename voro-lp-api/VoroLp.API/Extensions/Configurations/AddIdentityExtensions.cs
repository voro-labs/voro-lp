using VoroLp.Domain.Entities.Identity;
using VoroLp.Infrastructure.Factories;
using Microsoft.AspNetCore.Identity;

namespace VoroLp.API.Extensions.Configurations
{
    public static class AddIdentityExtensions
    {
        public static IServiceCollection AddCustomIdentity(this IServiceCollection services)
        {
            services.AddIdentity<User, Role>()
                .AddEntityFrameworkStores<JasmimDbContext>()
                .AddDefaultTokenProviders();

            services.AddScoped<SignInManager<User>>();
            services.AddScoped<UserManager<User>>();
            services.AddScoped<RoleManager<Role>>();

            return services;
        }
    }
}
