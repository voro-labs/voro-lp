using VoroLp.Application.DTOs.Evolution.API;
using VoroLp.Application.DTOs.Request;
using VoroLp.Domain.Entities.Evolution;

namespace VoroLp.Application.Services.Interfaces.Evolution
{
    public interface IEvolutionService
    {
        Task<(Contact? senderContact, Group? group, Chat chat)> CreateChatAndGroupOrContactAsync(
            string instanceName, string normalizedJid, string pushName,
            string remoteJid, bool isGroup = false, string? participant = "");

        Task<GroupEventDto?> GetGroupAsync(string groupJId);
        Task<IEnumerable<GroupEventDto>> GetGroupsAsync();
        Task<IEnumerable<ContactEventDto>> GetContactsAsync();
        Task<InstanceEventDto> GetInstanceStatusAsync();
        Task<string> SendMessageAsync(string contactNumber, MessageRequestDto request);
    }
}
