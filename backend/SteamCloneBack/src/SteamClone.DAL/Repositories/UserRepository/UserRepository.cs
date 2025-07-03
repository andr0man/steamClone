using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using SteamClone.DAL.Data;
using SteamClone.DAL.Repositories.Common;
using SteamClone.Domain.Models;

namespace SteamClone.DAL.Repositories.UserRepository;

public class UserRepository(AppDbContext appDbContext)
    : Repository<User, string>(appDbContext), IUserRepository
{
    private readonly AppDbContext _appDbContext = appDbContext;

    public async Task<User?> GetByEmailAsync(string email, CancellationToken token, bool includes = false)
    {
        return await GetUserAsync(u => u.Email == email, token, includes);
    }

    public async Task<User?> GetByIdAsync(string id, CancellationToken token, bool includes = false)
    {
        return await GetUserAsync(u => u.Id == id, token, includes);
    }

    public async Task<User?> GetByUserNicknameAsync(string nickName, CancellationToken token, bool includes = false)
    {
        return await GetUserAsync(u => u.Nickname == nickName, token, includes);
    }

    private async Task<User?> GetUserAsync(Expression<Func<User, bool>> predicate, CancellationToken token,
        bool includes = false)
    {
        if (includes)
        {
            return await _appDbContext.Users
                .Include(ur => ur.Role)
                .Include(uc => uc.Country)
                .FirstOrDefaultAsync(predicate, token);
        }

        return await _appDbContext.Users
            .FirstOrDefaultAsync(predicate, token);
    }

    public async Task<bool> IsUniqueEmailAsync(string email, CancellationToken token)
    {
        return await _appDbContext.Users.FirstOrDefaultAsync(u => u.Email == email, token) == null;
    }

    public async Task<bool> IsUniqueNicknameAsync(string nickName, CancellationToken token)
    {
        return await _appDbContext.Users.FirstOrDefaultAsync(u => u.Nickname == nickName, token) == null;
    }
}