using VoroLp.Infrastructure.Factories;
using Microsoft.EntityFrameworkCore.Storage;

namespace VoroLp.Infrastructure.UnitOfWork
{
    public interface IUnitOfWork : IDisposable, IAsyncDisposable
    {
        JasmimDbContext Context { get; }

        int SaveChanges();
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);

        IDbContextTransaction BeginTransaction();
        Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken = default);

        Task CommitAsync(CancellationToken cancellationToken = default);
        Task RollbackAsync(CancellationToken cancellationToken = default);
    }
}
