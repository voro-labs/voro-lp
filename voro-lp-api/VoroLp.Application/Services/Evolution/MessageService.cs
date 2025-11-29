using AutoMapper;
using VoroLp.Application.DTOs.Evolution;
using VoroLp.Application.Services.Base;
using VoroLp.Application.Services.Interfaces.Evolution;
using VoroLp.Domain.Entities.Evolution;
using VoroLp.Domain.Interfaces.Repositories.Evolution;

namespace VoroLp.Application.Services.Evolution
{
    public class MessageService(IMessageRepository messageRepository, IMapper mapper) : ServiceBase<Message>(messageRepository), IMessageService
    {
        public Task AddAsync(MessageDto messageDto)
        {
            var message = mapper.Map<Message>(messageDto);

            return this.AddAsync(message);
        }

        public Task AddRangeAsync(IEnumerable<MessageDto> messageDtos)
        {
            var messages = mapper.Map<IEnumerable<Message>>(messageDtos);

            return this.AddRangeAsync(messages);
        }
    }
}
