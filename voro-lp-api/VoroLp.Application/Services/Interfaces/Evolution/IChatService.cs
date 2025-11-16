using VoroLp.Application.Services.Interfaces.Base;
using VoroLp.Domain.Entities.Evolution;

namespace VoroLp.Application.Services.Interfaces.Evolution
{
    public interface IChatService : IServiceBase<Chat>
    {
        Task<Chat> GetOrCreateChat(string remoteJid, Instance instance, bool isGroup);
    }
}
