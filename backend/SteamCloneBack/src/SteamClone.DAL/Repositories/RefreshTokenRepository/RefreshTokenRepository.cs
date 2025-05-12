using Microsoft.EntityFrameworkCore;
using SteamClone.DAL.Data;
using SteamClone.DAL.Models;

namespace SteamClone.DAL.Repositories.RefreshTokenRepository;

public class RefreshTokenRepository(AppDbContext context) : IRefreshTokenRepository
{
    public async Task<RefreshToken?> GetRefreshTokenAsync(string refreshToken)
    {
        var entity = await context.RefreshTokens
            .FirstOrDefaultAsync(t => t.Token == refreshToken);

        return entity;
    }

    public async Task<RefreshToken> Create(RefreshToken model)
    {
        await context.RefreshTokens.AddAsync(model);
        await context.SaveChangesAsync();

        return model;
    }

    public async Task MakeAllRefreshTokensExpiredForUser(string userId)
    {
        await context.RefreshTokens.Where(t => t.UserId == userId)
            .ExecuteUpdateAsync(updates => 
                updates.SetProperty(t => t.IsUsed, true));
    }
}