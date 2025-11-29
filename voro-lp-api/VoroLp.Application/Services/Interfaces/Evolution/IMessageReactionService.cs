using VoroLp.Application.DTOs.Evolution;
using VoroLp.Application.Services.Interfaces.Base;
using VoroLp.Domain.Entities.Evolution;

namespace VoroLp.Application.Services.Interfaces.Evolution
{
    public interface IMessageReactionService : IServiceBase<MessageReaction>
    {
        Task AddAsync(MessageReactionDto messageReactionDto);
        Task AddRangeAsync(IEnumerable<MessageReactionDto> messageReactionDtos);
    }
}
