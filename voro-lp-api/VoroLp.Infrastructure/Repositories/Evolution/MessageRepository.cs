using VoroLp.Infrastructure.UnitOfWork;
using VoroLp.Infrastructure.Repositories.Base;
using VoroLp.Domain.Entities.Evolution;
using VoroLp.Domain.Interfaces.Repositories.Evolution;

namespace VoroLp.Infrastructure.Repositories
{
    public class MessageRepository(IUnitOfWork unitOfWork) : RepositoryBase<Message>(unitOfWork), IMessageRepository
    {

    }
}
