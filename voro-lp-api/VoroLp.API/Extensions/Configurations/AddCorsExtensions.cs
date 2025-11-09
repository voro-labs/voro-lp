namespace VoroLp.API.Extensions.Configurations
{
    public static class AddCorsExtensions
    {
        public static IServiceCollection AddCustomCors(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddCors(options =>
            {
                var corsSettings = configuration.GetSection("CorsSettings");
                var allowedOrigins = corsSettings.GetSection("AllowedOrigins").Get<string[]>();

                options.AddPolicy("JasmimCors", policyBuilder =>
                    policyBuilder
                        .WithOrigins(allowedOrigins ?? [])
                        .AllowAnyHeader()
                        .AllowAnyMethod());
            });

            return services;
        }
    }
}
