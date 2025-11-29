using AutoMapper;
using Microsoft.EntityFrameworkCore;
using VoroLp.Application.DTOs.Evolution;
using VoroLp.Application.Services.Base;
using VoroLp.Application.Services.Interfaces.Evolution;
using VoroLp.Domain.Entities.Evolution;
using VoroLp.Domain.Interfaces.Repositories.Evolution;

namespace VoroLp.Application.Services.Evolution
{
    public class GroupService(IGroupRepository groupRepository, IMapper mapper) : ServiceBase<Group>(groupRepository), IGroupService
    {
        public Task AddAsync(GroupDto groupDto)
        {
            var group = mapper.Map<Group>(groupDto);

            return this.AddAsync(group);
        }

        public Task AddRangeAsync(IEnumerable<GroupDto> groupDtos)
        {
            var groups = mapper.Map<IEnumerable<Group>>(groupDtos);

            return this.AddRangeAsync(groups);
        }

        public async Task<Group> GetOrCreateGroup(string groupJid, string? displayName)
        {
            var group = await this
                .Query(g => g.RemoteJid == groupJid)
                .FirstOrDefaultAsync();

            if (group != null)
                return group;

            group = new Group
            {
                Name = displayName ?? "Desconhecido",
                RemoteJid = groupJid
            };

            await this.AddAsync(group);
            await this.SaveChangesAsync();

            return group;
        }
    }
}
