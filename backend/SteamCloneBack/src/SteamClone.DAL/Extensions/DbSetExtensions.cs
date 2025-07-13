using SteamClone.DAL.Data;
using SteamClone.Domain.Common.Abstractions;

namespace SteamClone.DAL.Extensions;

public static class DbSetExtensions
{
    public static async Task AddAuditableAsync<TKey>(
        this AppDbContext dbContext,
        AuditableEntity<TKey> entity,
        CancellationToken cancellationToken = default)
    {
        entity.CreatedAt = DateTime.UtcNow;
        entity.ModifiedBy = entity.CreatedBy;
        entity.ModifiedAt = DateTime.UtcNow;

        await dbContext.AddAsync(entity, cancellationToken);
    }

    public static void UpdateAuditable<TKey>(
        this AppDbContext dbContext,
        AuditableEntity<TKey> entity)
    {
        entity.ModifiedAt = DateTime.UtcNow;

        dbContext.Update(entity);
    }
}