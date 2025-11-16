using VoroLp.Infrastructure.UnitOfWork;
using VoroLp.Infrastructure.Repositories.Base;
using VoroLp.Domain.Entities.Evolution;
using VoroLp.Domain.Interfaces.Repositories.Evolution;

namespace VoroLp.Infrastructure.Repositories
{
    public class ChatRepository(IUnitOfWork unitOfWork) : RepositoryBase<Chat>(unitOfWork), IChatRepository
    {

    }
}
