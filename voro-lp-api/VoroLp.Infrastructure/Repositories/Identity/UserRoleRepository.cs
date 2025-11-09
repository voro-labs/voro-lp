using VoroLp.Domain.Entities.Identity;
using VoroLp.Domain.Interfaces.Repositories.Identity;
using VoroLp.Infrastructure.Repositories.Base;
using VoroLp.Infrastructure.UnitOfWork;

namespace VoroLp.Infrastructure.Repositories.Identity
{
    public class UserRoleRepository(IUnitOfWork unitOfWork) : RepositoryBase<UserRole>(unitOfWork), IUserRoleRepository
    {

    }
}
