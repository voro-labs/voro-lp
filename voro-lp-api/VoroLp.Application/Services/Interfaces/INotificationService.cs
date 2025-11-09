using VoroLp.Domain.Entities;
using VoroLp.Application.Services.Interfaces.Base;

namespace VoroLp.Application.Services.Interfaces
{
    public interface INotificationService : IServiceBase<Notification>
    {
        Task SendWelcomeAsync(string email, string userName);

        Task SendResetLinkAsync(string email, string userName, string token);
    }
}
