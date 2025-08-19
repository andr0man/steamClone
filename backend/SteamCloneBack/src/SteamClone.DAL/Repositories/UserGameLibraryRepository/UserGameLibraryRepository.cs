using Microsoft.EntityFrameworkCore;
using SteamClone.DAL.Data;
using SteamClone.Domain.Models.Auth.Users;

namespace SteamClone.DAL.Repositories.UserGameLibraryRepository;

public class UserGameLibraryRepository(AppDbContext appDbContext) : IUserGameLibraryRepository
{
    public async Task<UserGameLibrary?> CreateAsync(UserGameLibrary userGameLibrary, CancellationToken token)
    {
        await appDbContext.UserGameLibraries.AddAsync(userGameLibrary, token);
        await appDbContext.SaveChangesAsync(token);
        return userGameLibrary;
    }

    public async Task<UserGameLibrary?> UpdateAsync(UserGameLibrary userGameLibrary, CancellationToken token)
    {
        appDbContext.UserGameLibraries.Update(userGameLibrary);
        await appDbContext.SaveChangesAsync(token);
        return userGameLibrary;
    }

    public async Task<UserGameLibrary?> DeleteAsync(string userId, string gameId, CancellationToken token)
    {
        var userGameLibrary =
            await appDbContext.UserGameLibraries.FirstOrDefaultAsync(
                ugl => ugl.UserId == userId && ugl.GameId == gameId, token);
        appDbContext.UserGameLibraries.Remove(userGameLibrary!);
        await appDbContext.SaveChangesAsync(token);
        return null;
    }

    public async Task<UserGameLibrary?> GetAsync(string userId, string gameId, CancellationToken token,
        bool asNoTracking = false)
    {
        var query = appDbContext.UserGameLibraries.Include(ugl => ugl.Game).AsQueryable();
        if (asNoTracking)
            query = query.AsNoTracking();
        return await query.FirstOrDefaultAsync(ugl => ugl.UserId == userId && ugl.GameId == gameId, token);
    }

    public async Task<List<UserGameLibrary>> GetByUserIdAsync(string userId, CancellationToken token)
    {
        return await appDbContext.UserGameLibraries.Include(ugl => ugl.Game).Where(ugl => ugl.UserId == userId)
            .ToListAsync(token);
    }
}