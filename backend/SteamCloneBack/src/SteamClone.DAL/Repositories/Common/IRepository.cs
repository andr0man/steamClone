using SteamClone.DAL.Models.Common.Interfaces;

namespace SteamClone.DAL.Repositories.Common;

public interface IRepository<TEntity, TKey>
    where TEntity : Entity<TKey>
{
    Task<IEnumerable<TEntity>> GetAllAsync();
    Task<TEntity?> GetByIdAsync(TKey id);
    Task<TEntity?> CreateAsync(TEntity entity);
    Task<TEntity?> UpdateAsync(TEntity entity);
    Task<TEntity?> DeleteAsync(TKey id);
    Task SaveAsync();
}