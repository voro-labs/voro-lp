using Microsoft.EntityFrameworkCore;
using VoroLp.Application.Services.Base;
using VoroLp.Application.Services.Interfaces.Evolution;
using VoroLp.Domain.Entities.Evolution;
using VoroLp.Domain.Interfaces.Repositories.Evolution;

namespace VoroLp.Application.Services.Evolution
{
    public class GroupMemberService(IGroupMemberRepository groupMemberRepository) : 
        ServiceBase<GroupMember>(groupMemberRepository), IGroupMemberService
    {
        public async Task EnsureGroupMembership(Group group, Contact contact)
        {
            var exists = await this
                .Query(m => m.GroupId == group.Id && m.ContactId == contact.Id)
                .AnyAsync();

            if (exists)
                return;

            await this.AddAsync(new GroupMember
            {
                GroupId = group.Id,
                ContactId = contact.Id,
                JoinedAt = DateTimeOffset.UtcNow
            });

            await this.SaveChangesAsync();
        }

    }
}
