using VoroLp.Domain.Interfaces.Repositories.Base;
using VoroLp.Infrastructure.UnitOfWork;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace VoroLp.Infrastructure.Repositories.Base
{
    public class RepositoryBase<T>(IUnitOfWork unitOfWork) : IRepositoryBase<T> where T : class
    {
        private readonly IUnitOfWork _unitOfWork = unitOfWork;
        private readonly DbSet<T> _dbSet = unitOfWork.Context.Set<T>();

        public async Task AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
        }

        public async Task AddRangeAsync(IEnumerable<T> entities)
        {
            await _dbSet.AddRangeAsync(entities);
        }

        public void Delete(T entity)
        {
            _dbSet.Remove(entity);
        }

        public async Task DeleteAsync(params object[] keyValues)
        {
            var entity = await _dbSet.FindAsync(keyValues);
            if (entity != null)
                _dbSet.Remove(entity);
        }

        public async Task<IEnumerable<T>> GetAllAsync(bool asNoTracking = true)
        {
            var query = _dbSet.AsQueryable();
            if (asNoTracking)
                query = query.AsNoTracking();

            return await query.ToListAsync();
        }

        public async Task<T?> GetByIdAsync(params object[] keyValues)
        {
            return await _dbSet.FindAsync(keyValues);
        }

        public IQueryable<T> Include(params Expression<Func<T, object>>[] includes)
        {
            IQueryable<T> query = _dbSet;

            foreach (var include in includes)
                query = query.Include(include);

            return query;
        }

        public IQueryable<T> Query(Expression<Func<T, bool>>? predicate = null, bool asNoTracking = true)
        {
            IQueryable<T> query = _dbSet;

            if (predicate != null)
                query = query.Where(predicate);

            if (asNoTracking)
                query = query.AsNoTracking();

            return query;
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _unitOfWork.SaveChangesAsync();
        }

        public void Update(T entity)
        {
            _dbSet.Update(entity);
        }

        public void UpdateRange(IEnumerable<T> entities)
        {
            _dbSet.UpdateRange(entities);
        }
    }
}
