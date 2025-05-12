using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using SteamClone.DAL.Data;
using SteamClone.DAL.Models;
using SteamClone.DAL.Models.Common.Interfaces;

namespace SteamClone.DAL.Repositories.Common;

public class Repository<TEntity, TKey>(AppDbContext appDbContext) : IRepository<TEntity, TKey>
    where TEntity : Entity<TKey>
{

    public virtual async Task<IEnumerable<TEntity>> GetAllAsync() => await appDbContext.Set<TEntity>().ToListAsync();

    public virtual async Task<TEntity?> CreateAsync(TEntity entity)
    {
        await appDbContext.Set<TEntity>().AddAsync(entity);
        await SaveAsync();
            
        return entity;
    }
    public virtual async Task<TEntity?> UpdateAsync(TEntity entity)
    {
        appDbContext.Set<TEntity>().Update(entity);
        await SaveAsync();
            
        return entity;
    }
    public virtual async Task<TEntity?> DeleteAsync(TKey id)
    {
        var entity = await appDbContext.Set<TEntity>().FindAsync(id);
        appDbContext.Set<TEntity>().Remove(entity!);
        await SaveAsync();

        return entity;
    }
    public virtual async Task<TEntity?> GetByIdAsync(TKey id)
    {
        return await appDbContext.Set<TEntity>().FindAsync(id);
    }

    public async Task SaveAsync() => await appDbContext.SaveChangesAsync();

    public async Task<User?> GetByEmailAsync(string email, bool includes = false)
    {
        return await GetUserAsync(u => u.Email == email, includes);
    }

    public async Task<User?> GetByIdAsync(string id, bool includes = false)
    {
        return await GetUserAsync(u => u.Id == id, includes);
    }

    public async Task<User?> GetByUsernameAsync(string nickName, bool includes = false)
    {
        return await GetUserAsync(u => u.Nickname == nickName, includes);
    }

    public async Task<User?> GetUserAsync(Expression<Func<User, bool>> predicate, bool includes = false)
    {
        if (includes)
        {
            return await appDbContext.Users
                .Include(ur => ur.Role)
                .FirstOrDefaultAsync(predicate);
        }
        else
        {
            return await appDbContext.Users
                .FirstOrDefaultAsync(predicate);
        }
    }

    public async Task<bool> IsUniqueEmailAsync(string email)
    {
        return await appDbContext.Users.FirstOrDefaultAsync(u => u.Email == email) == null;
    }

    public async Task<bool> IsUniqueUserNameAsync(string nickName)
    {
        return await appDbContext.Users.FirstOrDefaultAsync(u => u.Nickname == nickName) == null;
    }
}