using VoroLp.Application.DTOs.Evolution;
using VoroLp.Application.Services.Interfaces.Base;
using VoroLp.Domain.Entities.Evolution;

namespace VoroLp.Application.Services.Interfaces.Evolution
{
    public interface IContactService : IServiceBase<Contact>
    {
        Task AddAsync(ContactDto contactDto);
        Task AddRangeAsync(IEnumerable<ContactDto> contactDtos);
        Task<Contact?> FindByAnyAsync(string jid);
        Task<Contact?> UpdateContact(Contact contact, string? displayName, string? profilePicture);
    }
}
