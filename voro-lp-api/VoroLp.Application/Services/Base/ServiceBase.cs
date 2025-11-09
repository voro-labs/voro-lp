using VoroLp.Application.Services.Interfaces.Base;
using VoroLp.Domain.Interfaces.Repositories.Base;
using System.Linq.Expressions;

namespace VoroLp.Application.Services.Base
{
    public class ServiceBase<T>(IRepositoryBase<T> repository) : IServiceBase<T> where T : class
    {
        private readonly IRepositoryBase<T> _repository = repository;

        public Task<IEnumerable<T>> GetAllAsync(bool asNoTracking = true)
            => _repository.GetAllAsync(asNoTracking);

        public Task<T?> GetByIdAsync(params object[] keyValues)
            => _repository.GetByIdAsync(keyValues);

        public IQueryable<T> Query(Expression<Func<T, bool>>? predicate = null, bool asNoTracking = true)
            => _repository.Query(predicate, asNoTracking);

        public Task AddAsync(T entity)
            => _repository.AddAsync(entity);

        public Task AddRangeAsync(IEnumerable<T> entities)
            => _repository.AddRangeAsync(entities);

        public void Update(T entity)
            => _repository.Update(entity);

        public void UpdateRange(IEnumerable<T> entities)
            => _repository.UpdateRange(entities);

        public Task DeleteAsync(params object[] keyValues)
            => _repository.DeleteAsync(keyValues);

        public void Delete(T entity)
            => _repository.Delete(entity);

        public Task<int> SaveChangesAsync()
            => _repository.SaveChangesAsync();
    }
}
