using VoroLp.Application.DTOs.Evolution;
using VoroLp.Application.Services.Interfaces.Base;
using VoroLp.Domain.Entities.Evolution;

namespace VoroLp.Application.Services.Interfaces.Evolution
{
    public interface IInstanceService : IServiceBase<Instance>
    {
        Task AddAsync(InstanceDto instanceDto);
        Task AddRangeAsync(IEnumerable<InstanceDto> instanceDtos);
        Task<Instance> GetOrCreateInstance(string name);
    }
}
