using AutoMapper;
using Microsoft.EntityFrameworkCore;
using VoroLp.Application.DTOs.Evolution;
using VoroLp.Application.Services.Base;
using VoroLp.Application.Services.Interfaces.Evolution;
using VoroLp.Domain.Entities.Evolution;
using VoroLp.Domain.Interfaces.Repositories.Evolution;

namespace VoroLp.Application.Services.Evolution
{
    public class ContactService(IContactRepository contactRepository, IMapper mapper) 
        : ServiceBase<Contact>(contactRepository), IContactService
    {
        public Task AddAsync(ContactDto contactDto)
        {
            var contact = mapper.Map<Contact>(contactDto);

            return this.AddAsync(contact);
        }

        public Task AddRangeAsync(IEnumerable<ContactDto> contactDtos)
        {
            var contacts = mapper.Map<IEnumerable<Contact>>(contactDtos);

            return this.AddRangeAsync(contacts);
        }

        public async Task<Contact?> FindByAnyAsync(string jid)
        {
            return await this.Query(c =>
                    c.RemoteJid == jid ||
                    c.Identifiers.Any(i => i.Jid == jid))
                .Include(c => c.Identifiers)
                .FirstOrDefaultAsync();
        }

        public async Task<Contact?> UpdateContact(
            Contact contact,
            string? displayName,
            string? profilePicture)
        {
            if (contact != null)
            {
                if (!string.IsNullOrEmpty(displayName))
                    contact.DisplayName = displayName;

                if (!string.IsNullOrEmpty(profilePicture) &&
                    (string.IsNullOrEmpty(contact.ProfilePictureUrl) 
                    || contact.ProfilePictureUrl is not null && !contact.ProfilePictureUrl.StartsWith("data:")))
                    contact.ProfilePictureUrl = profilePicture;

                contact.UpdatedAt = DateTimeOffset.UtcNow;
                
                this.Update(contact);
            }


            return contact;
        }

        public async Task<Contact> GetOrCreateContact(
            string remoteJid,
            string displayName)
        {
            var contact = await this
                .Query(c => c.RemoteJid == remoteJid)
                .FirstOrDefaultAsync();

            // Já existe → retorna
            if (contact != null)
                return contact;

            contact = new Contact
            {
                RemoteJid = $"{remoteJid}",
                Number = remoteJid.Split("@")[0],
                DisplayName = displayName, // só salva se for válido
                UpdatedAt = DateTimeOffset.UtcNow
            };

            await this.AddAsync(contact);
            await this.SaveChangesAsync();

            return contact;
        }
    }
}
