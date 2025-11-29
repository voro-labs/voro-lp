using VoroLp.Application.Services.Interfaces.Base;
using VoroLp.Domain.Entities.Evolution;

namespace VoroLp.Application.Services.Interfaces.Evolution
{
    public interface IGroupMemberService : IServiceBase<GroupMember>
    {
        Task EnsureGroupMembership(Group group, Contact contact);
    }
}
