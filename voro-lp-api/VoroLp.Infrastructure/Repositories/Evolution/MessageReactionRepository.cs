using VoroLp.Infrastructure.UnitOfWork;
using VoroLp.Infrastructure.Repositories.Base;
using VoroLp.Domain.Entities.Evolution;
using VoroLp.Domain.Interfaces.Repositories.Evolution;

namespace VoroLp.Infrastructure.Repositories
{
    public class MessageReactionRepository(IUnitOfWork unitOfWork) : RepositoryBase<MessageReaction>(unitOfWork), IMessageReactionRepository
    {

    }
}
