using VoroLp.Domain.Interfaces.Repositories.Identity;
using VoroLp.Infrastructure.UnitOfWork;
using VoroLp.Domain.Entities.Identity;
using VoroLp.Infrastructure.Repositories.Base;

namespace VoroLp.Infrastructure.Repositories.Identity
{
    public class RoleRepository(IUnitOfWork unitOfWork) : RepositoryBase<Role>(unitOfWork), IRoleRepository
    {
       
    }
}
