using AutoMapper;
using Microsoft.EntityFrameworkCore;
using VoroLp.Application.DTOs.Evolution;
using VoroLp.Application.Services.Base;
using VoroLp.Application.Services.Interfaces.Evolution;
using VoroLp.Domain.Entities.Evolution;
using VoroLp.Domain.Interfaces.Repositories.Evolution;

namespace VoroLp.Application.Services.Evolution
{
    public class InstanceService(IInstanceRepository instanceRepository, IMapper mapper) : ServiceBase<Instance>(instanceRepository), IInstanceService
    {
        public Task AddAsync(InstanceDto instanceDto)
        {
            var instance = mapper.Map<Instance>(instanceDto);

            return this.AddAsync(instance);
        }

        public Task AddRangeAsync(IEnumerable<InstanceDto> instanceDtos)
        {
            var instances = mapper.Map<IEnumerable<Instance>>(instanceDtos);

            return this.AddRangeAsync(instances);
        }

        public async Task<Instance> GetOrCreateInstance(string name)
        {
            name = name.ToLower();

            var instance = await this
                .Query(i => i.Name == name)
                .FirstOrDefaultAsync();

            if (instance != null)
                return instance;

            instance = new Instance { Name = name };

            await this.AddAsync(instance);
            await this.SaveChangesAsync();

            return instance;
        }
    }
}
