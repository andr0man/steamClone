using Microsoft.EntityFrameworkCore;
using SteamClone.DAL.Data;
using SteamClone.Domain.Models.Common.Abstractions;

namespace SteamClone.DAL.Repositories.Common;

public class RepositoryNotAuditable<TEntity, TKey>(AppDbContext appDbContext) : IRepository<TEntity, TKey>
    where TEntity : Entity<TKey>
{

    public virtual async Task<IEnumerable<TEntity>> GetAllAsync(CancellationToken token) => await appDbContext.Set<TEntity>().AsNoTracking().ToListAsync(token);

    public virtual async Task<TEntity?> CreateAsync(TEntity entity, CancellationToken token)
    {
        await appDbContext.Set<TEntity>()
            .AddAsync(entity, token);
        await SaveAsync(token);
            
        return entity;
    }
    public virtual async Task<TEntity?> UpdateAsync(TEntity entity, CancellationToken token)
    {
        appDbContext.Set<TEntity>().Update(entity);
        await SaveAsync(token);
            
        return entity;
    }
    public virtual async Task<TEntity?> DeleteAsync(TKey id, CancellationToken token)
    {
        var entity = await appDbContext.Set<TEntity>().FirstOrDefaultAsync(entity => entity.Id!.Equals(id), token);
        appDbContext.Set<TEntity>().Remove(entity!);
        await SaveAsync(token);

        return entity;
    }
    public virtual async Task<TEntity?> GetByIdAsync(TKey id, CancellationToken token, bool asNoTracking = false)
    {
        if (asNoTracking)
        {
            return await appDbContext.Set<TEntity>().AsNoTracking().FirstOrDefaultAsync(entity => entity.Id!.Equals(id), token);
        }
        
        return await appDbContext.Set<TEntity>().FirstOrDefaultAsync(entity => entity.Id!.Equals(id), token);
    }

    public async Task SaveAsync(CancellationToken token) => await appDbContext.SaveChangesAsync(token);
}