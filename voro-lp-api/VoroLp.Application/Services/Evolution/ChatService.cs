using Microsoft.EntityFrameworkCore;
using VoroLp.Application.Services.Base;
using VoroLp.Application.Services.Interfaces.Evolution;
using VoroLp.Domain.Entities.Evolution;
using VoroLp.Domain.Interfaces.Repositories.Evolution;

namespace VoroLp.Application.Services.Evolution
{
    public class ChatService(IChatRepository chatRepository) : ServiceBase<Chat>(chatRepository), IChatService
    {
        public async Task<Chat> GetOrCreateChat(string remoteJid, Instance instance, bool isGroup)
        {
            var chat = await this
                .Query(c => c.RemoteJid == remoteJid)
                .FirstOrDefaultAsync();

            if (chat != null)
                return chat;

            chat = new Chat
            {
                RemoteJid = remoteJid,
                IsGroup = isGroup,
                InstanceId = instance.Id,
                UpdatedAt = DateTimeOffset.UtcNow
            };

            await this.AddAsync(chat);
            await this.SaveChangesAsync();

            return chat;
        }
    }
}
