using VoroLp.Domain.Entities.Identity;
using VoroLp.Domain.Interfaces.Repositories.Identity;
using VoroLp.Infrastructure.Repositories.Base;
using VoroLp.Infrastructure.UnitOfWork;

namespace VoroLp.Infrastructure.Repositories.Identity
{
    public class UserRepository(IUnitOfWork unitOfWork) : RepositoryBase<User>(unitOfWork), IUserRepository
    {
    }
}
