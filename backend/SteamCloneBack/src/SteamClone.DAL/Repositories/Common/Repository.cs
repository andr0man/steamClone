using Microsoft.EntityFrameworkCore;
using SteamClone.DAL.Data;
using SteamClone.DAL.Extensions;
using SteamClone.Domain.Common.Abstractions;
using SteamClone.Domain.Common.Interfaces;

namespace SteamClone.DAL.Repositories.Common;

public class Repository<TEntity, TKey>(AppDbContext appDbContext, IUserProvider userProvider)
    : IRepository<TEntity, TKey>
    where TEntity : Entity<TKey>
{
    public virtual async Task<IEnumerable<TEntity>> GetAllAsync(CancellationToken token) =>
        await appDbContext.Set<TEntity>().AsNoTracking().ToListAsync(token);

    public virtual async Task<TEntity?> CreateAsync(TEntity entity, CancellationToken token)
    {
        if (entity is AuditableEntity<TKey> auditable)
        {
            auditable.CreatedBy ??= await userProvider.GetUserId();

            await appDbContext.AddAuditableAsync(auditable, token);
        }
        else
        {
            await appDbContext.Set<TEntity>().AddAsync(entity, token);
        }

        await SaveAsync(token);
        return entity;
    }

    public virtual async Task<TEntity?> UpdateAsync(TEntity entity, CancellationToken token)
    {
        if (entity is AuditableEntity<TKey> auditable)
        {
            auditable.ModifiedBy = await userProvider.GetUserId();

            appDbContext.UpdateAuditable(auditable);
        }
        else
        {
            appDbContext.Set<TEntity>().Update(entity);
        }

        await SaveAsync(token);
        return entity;
    }

    public virtual async Task<TEntity?> DeleteAsync(TKey id, CancellationToken token)
    {
        var entity = await appDbContext.Set<TEntity>().FirstOrDefaultAsync(e => e.Id!.Equals(id), token);
        appDbContext.Set<TEntity>().Remove(entity!);
        await SaveAsync(token);
        return entity;
    }

    public virtual async Task<TEntity?> GetByIdAsync(TKey id, CancellationToken token, bool asNoTracking = false)
    {
        var query = appDbContext.Set<TEntity>().AsQueryable();
        if (asNoTracking)
            query = query.AsNoTracking();
        return await query.FirstOrDefaultAsync(e => e.Id!.Equals(id), token);
    }

    private async Task SaveAsync(CancellationToken token) => await appDbContext.SaveChangesAsync(token);
}