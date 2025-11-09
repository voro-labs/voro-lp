using VoroLp.Domain.Entities;
using VoroLp.Infrastructure.UnitOfWork;
using VoroLp.Domain.Interfaces.Repositories;
using VoroLp.Infrastructure.Repositories.Base;

namespace VoroLp.Infrastructure.Repositories
{
    public class NotificationRepository(IUnitOfWork unitOfWork) : RepositoryBase<Notification>(unitOfWork), INotificationRepository
    {

    }
}
