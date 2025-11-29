using VoroLp.Application.Services.Interfaces.Base;
using VoroLp.Domain.Entities.Evolution;
using VoroLp.Application.DTOs.Evolution;

namespace VoroLp.Application.Services.Interfaces.Evolution
{
    public interface IGroupService : IServiceBase<Group>
    {
        Task AddAsync(GroupDto entity);
        Task AddRangeAsync(IEnumerable<GroupDto> entities);
        Task<Group> GetOrCreateGroup(string groupJid, string? displayName);
    }
}
