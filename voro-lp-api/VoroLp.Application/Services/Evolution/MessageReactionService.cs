using AutoMapper;
using VoroLp.Application.DTOs.Evolution;
using VoroLp.Application.Services.Base;
using VoroLp.Application.Services.Interfaces.Evolution;
using VoroLp.Domain.Entities.Evolution;
using VoroLp.Domain.Interfaces.Repositories.Evolution;

namespace VoroLp.Application.Services.Evolution
{
    public class MessageReactionService(IMessageReactionRepository messageReactionRepository, IMapper mapper) : ServiceBase<MessageReaction>(messageReactionRepository), IMessageReactionService
    {
        public Task AddAsync(MessageReactionDto messageReactionDto)
        {
            var messageReaction = mapper.Map<MessageReaction>(messageReactionDto);

            return this.AddAsync(messageReaction);
        }

        public Task AddRangeAsync(IEnumerable<MessageReactionDto> messageReactionDtos)
        {
            var messageReactions = mapper.Map<IEnumerable<MessageReaction>>(messageReactionDtos);

            return this.AddRangeAsync(messageReactions);
        }
    }
}
