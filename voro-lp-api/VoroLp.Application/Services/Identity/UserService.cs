using VoroLp.Application.Services.Interfaces.Identity;
using VoroLp.Domain.Interfaces.Repositories.Identity;
using VoroLp.Domain.Entities.Identity;
using VoroLp.Application.Services.Base;

namespace VoroLp.Application.Services.Identity
{
    public class UserService(IUserRepository roleRepository) : ServiceBase<User>(roleRepository), IUserService
    {
        private readonly IUserRepository _roleRepository = roleRepository;
    }
}
