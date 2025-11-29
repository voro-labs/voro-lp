using VoroLp.Application.Services;
using VoroLp.Application.Services.Evolution;
using VoroLp.Application.Services.Identity;
using VoroLp.Application.Services.Interfaces;
using VoroLp.Application.Services.Interfaces.Email;
using VoroLp.Application.Services.Interfaces.Evolution;
using VoroLp.Application.Services.Interfaces.Identity;
using VoroLp.Domain.Interfaces.Repositories;
using VoroLp.Domain.Interfaces.Repositories.Evolution;
using VoroLp.Domain.Interfaces.Repositories.Identity;
using VoroLp.Infrastructure.Email;
using VoroLp.Infrastructure.Repositories;
using VoroLp.Infrastructure.Repositories.Identity;
using VoroLp.Infrastructure.Seeds;
using VoroLp.Infrastructure.UnitOfWork;
using VoroLp.Shared.Utils;

namespace VoroLp.API.Extensions.Configurations
{
    public static class AddAppServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<MailUtil>(configuration.GetSection("EmailSettings"));
            services.Configure<CookieUtil>(configuration.GetSection("CookieSettings"));
            services.Configure<EvolutionUtil>(configuration.GetSection("EvolutionSettings"));

            #region Identity Repositories
            services.AddScoped<IRoleRepository, RoleRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IUserRoleRepository, UserRoleRepository>();
            services.AddScoped<INotificationRepository, NotificationRepository>();
            services.AddScoped<IContactIdentifierRepository, ContactIdentifierRepository>();
            services.AddScoped<IContactRepository, ContactRepository>();
            services.AddScoped<IMessageRepository, MessageRepository>();
            services.AddScoped<IMessageReactionRepository, MessageReactionRepository>();
            services.AddScoped<IGroupMemberRepository, GroupMemberRepository>();
            services.AddScoped<IGroupRepository, GroupRepository>();
            services.AddScoped<IChatRepository, ChatRepository>();
            services.AddScoped<IInstanceRepository, InstanceRepository>();
            #endregion

            #region Identity Services
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IRoleService, RoleService>();
            services.AddScoped<IUserRoleService, UserRoleService>();
            services.AddScoped<INotificationService, NotificationService>();
            services.AddScoped<IContactIdentifierService, ContactIdentifierService>();
            services.AddScoped<IContactService, ContactService>();
            services.AddScoped<IMessageService, MessageService>();
            services.AddScoped<IMessageReactionService, MessageReactionService>();
            services.AddScoped<IGroupMemberService, GroupMemberService>();
            services.AddScoped<IGroupService, GroupService>();
            services.AddScoped<IChatService, ChatService>();
            services.AddScoped<IInstanceService, InstanceService>();

            #endregion

            services.AddScoped<IDataSeeder, DataSeeder>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IEvolutionService, EvolutionService>();
            services.AddScoped<ICurrentUserService, CurrentUserService>();
            services.AddScoped<IMailKitEmailService, MailKitEmailService>();

            services.AddSignalR();

            return services;
        }
    }
}
