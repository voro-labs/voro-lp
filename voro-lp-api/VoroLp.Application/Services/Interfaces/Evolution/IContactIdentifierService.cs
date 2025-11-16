using VoroLp.Application.DTOs.Evolution;
using VoroLp.Application.Services.Interfaces.Base;
using VoroLp.Domain.Entities.Evolution;

namespace VoroLp.Application.Services.Interfaces.Evolution
{
    public interface IContactIdentifierService : IServiceBase<ContactIdentifier>
    {
        Task<ContactIdentifier> GetOrCreateAsync(string remoteJid, string? remoteJidAlt);
        Task AddAsync(ContactIdentifierDto contactIdentifierDto);
    }
}
