using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using SteamClone.DAL.Data;
using SteamClone.DAL.Models;
using SteamClone.DAL.Repositories.Common;

namespace SteamClone.DAL.Repositories.UserRepository;

public class UserRepository(AppDbContext appDbContext)
    : Repository<User, string>(appDbContext), IUserRepository
{
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

    private async Task<User?> GetUserAsync(Expression<Func<User, bool>> predicate, bool includes = false)
    {
        if (includes)
        {
            return await appDbContext.Users
                .Include(ur => ur.Role)
                .FirstOrDefaultAsync(predicate);
        }

        return await appDbContext.Users
            .FirstOrDefaultAsync(predicate);
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