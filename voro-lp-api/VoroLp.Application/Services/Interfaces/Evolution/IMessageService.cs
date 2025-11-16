using VoroLp.Application.DTOs.Evolution;
using VoroLp.Application.Services.Interfaces.Base;
using VoroLp.Domain.Entities.Evolution;

namespace VoroLp.Application.Services.Interfaces.Evolution
{
    public interface IMessageService : IServiceBase<Message>
    {
        Task AddAsync(MessageDto messageDto);
        Task AddRangeAsync(IEnumerable<MessageDto> messageDtos);
    }
}
