using VoroLp.Application.Services.Interfaces.Identity;
using VoroLp.Domain.Interfaces.Repositories.Identity;
using Microsoft.EntityFrameworkCore;
using VoroLp.Domain.Entities.Identity;
using VoroLp.Application.Services.Base;

namespace VoroLp.Application.Services.Identity
{
    public class RoleService(IRoleRepository roleRepository) : ServiceBase<Role>(roleRepository), IRoleService
    {
        private readonly IRoleRepository _roleRepository = roleRepository;

        public async Task<Role?> GetByNameAsync(string roleName)
            => await _roleRepository.Query(r => r.Name == roleName).FirstOrDefaultAsync();
    }
}
