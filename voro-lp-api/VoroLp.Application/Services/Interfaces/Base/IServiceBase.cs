using System.Linq.Expressions;

namespace VoroLp.Application.Services.Interfaces.Base
{
    public interface IServiceBase<T> where T : class
    {
        Task<IEnumerable<T>> GetAllAsync(bool asNoTracking = true);
        Task<T?> GetByIdAsync(params object[] keyValues);
        IQueryable<T> Query(Expression<Func<T, bool>>? predicate = null, bool asNoTracking = true);

        Task AddAsync(T entity);
        Task AddRangeAsync(IEnumerable<T> entities);
        void Update(T entity);
        void UpdateRange(IEnumerable<T> entities);
        Task DeleteAsync(params object[] keyValues);
        void Delete(T entity);

        Task<int> SaveChangesAsync();
    }
}
