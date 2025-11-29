using VoroLp.Infrastructure.UnitOfWork;
using VoroLp.Infrastructure.Repositories.Base;
using VoroLp.Domain.Entities.Evolution;
using VoroLp.Domain.Interfaces.Repositories.Evolution;

namespace VoroLp.Infrastructure.Repositories
{
    public class InstanceRepository(IUnitOfWork unitOfWork) : RepositoryBase<Instance>(unitOfWork), IInstanceRepository
    {

    }
}
