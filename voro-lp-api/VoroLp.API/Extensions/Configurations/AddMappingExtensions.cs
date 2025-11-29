using VoroLp.Application.Mappings;
using VoroLp.Application.Mappings.Evolution;
using VoroLp.Application.Mappings.Identity;

namespace VoroLp.API.Extensions.Configurations
{
    public static class AddMappingExtensions
    {
        public static IServiceCollection AddAutoMapperConfig(this IServiceCollection services)
        {
            services.AddAutoMapper(cfg =>
            {
                cfg.AddProfile<IdentityMappingProfile>();
                cfg.AddProfile<GeneralMappingProfile>();
                cfg.AddProfile<ContactMappingProfile>();
                cfg.AddProfile<GroupMappingProfile>();
            });

            return services;
        }
    }
}
