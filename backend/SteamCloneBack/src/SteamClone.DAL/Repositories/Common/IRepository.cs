using SteamClone.DAL.Models.Common.Abstractions;
using SteamClone.DAL.Models.Common.Interfaces;

namespace SteamClone.DAL.Repositories.Common;

public interface IRepository<TEntity, in TKey>
    where TEntity : Entity<TKey>
{
    Task<IEnumerable<TEntity>> GetAllAsync(CancellationToken token);
    Task<TEntity?> GetByIdAsync(TKey id, CancellationToken token);
    Task<TEntity?> CreateAsync(TEntity entity, CancellationToken token);
    Task<TEntity?> UpdateAsync(TEntity entity, CancellationToken token);
    Task<TEntity?> DeleteAsync(TKey id, CancellationToken token);
    Task SaveAsync(CancellationToken token);
}