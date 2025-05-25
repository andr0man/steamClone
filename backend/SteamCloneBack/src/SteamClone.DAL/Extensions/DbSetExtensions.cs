using Microsoft.EntityFrameworkCore;
using SteamClone.DAL.Models.Common.Abstractions;
using SteamClone.DAL.Models.Common.Interfaces;

namespace SteamClone.DAL.Extensions;

public static class DbSetExtensions
{
    public static async Task AddAuditableAsync<TEntity, TKey>(
        this DbSet<TEntity> dbSet,
        TEntity entity,
        CancellationToken cancellationToken)
        where TEntity : AuditableEntity<TKey>
    {
        entity.CreatedAt = DateTime.UtcNow;
        entity.ModifiedBy = entity.CreatedBy;
        entity.ModifiedAt = DateTime.UtcNow;

        await dbSet.AddAsync(entity, cancellationToken);
    }
    
    public static void UpdateAuditable<TEntity, TKey>(
        this DbSet<TEntity> dbSet,
        TEntity entity)
        where TEntity : AuditableEntity<TKey>
    {
        entity.ModifiedBy = entity.ModifiedBy;
        entity.ModifiedAt = DateTime.UtcNow;

        dbSet.Update(entity);
    }
}