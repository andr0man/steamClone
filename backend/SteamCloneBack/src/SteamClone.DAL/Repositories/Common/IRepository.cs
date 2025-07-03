using SteamClone.Domain.Models.Common.Abstractions;

namespace SteamClone.DAL.Repositories.Common;

public interface IRepository<TEntity, in TKey>
    where TEntity : Entity<TKey>
{
    Task<IEnumerable<TEntity>> GetAllAsync(CancellationToken token);
    Task<TEntity?> GetByIdAsync(TKey id, CancellationToken token, bool asNoTracking = false);
    Task<TEntity?> CreateAsync(TEntity entity, CancellationToken token);
    Task<TEntity?> UpdateAsync(TEntity entity, CancellationToken token);
    Task<TEntity?> DeleteAsync(TKey id, CancellationToken token);
}