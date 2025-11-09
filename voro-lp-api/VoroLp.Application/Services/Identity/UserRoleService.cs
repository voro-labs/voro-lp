using VoroLp.Application.Services.Interfaces.Identity;
using VoroLp.Domain.Interfaces.Repositories.Identity;
using VoroLp.Domain.Entities.Identity;
using VoroLp.Application.Services.Base;

namespace VoroLp.Application.Services.Identity
{
    public class UserRoleService(IUserRoleRepository roleRepository) : ServiceBase<UserRole>(roleRepository), IUserRoleService
    {
        private readonly IUserRoleRepository _roleRepository = roleRepository;
    }
}
