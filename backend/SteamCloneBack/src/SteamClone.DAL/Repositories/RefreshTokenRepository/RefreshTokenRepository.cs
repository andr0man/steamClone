using Microsoft.EntityFrameworkCore;
using SteamClone.DAL.Data;
using SteamClone.Domain.Models;
using SteamClone.Domain.Models.Auth;

namespace SteamClone.DAL.Repositories.RefreshTokenRepository;

public class RefreshTokenRepository(AppDbContext context) : IRefreshTokenRepository
{
    public async Task<RefreshToken?> GetRefreshTokenAsync(string refreshToken, CancellationToken token)
    {
        var entity = await context.RefreshTokens
            .FirstOrDefaultAsync(t => t.Token == refreshToken, token);

        return entity;
    }

    public async Task<RefreshToken> Create(RefreshToken model, CancellationToken token)
    {
        await context.RefreshTokens.AddAsync(model, token);
        await context.SaveChangesAsync(token);

        return model;
    }

    public async Task MakeAllRefreshTokensExpiredForUser(string userId, CancellationToken token)
    {
        await context.RefreshTokens.Where(t => t.UserId == userId)
            .ExecuteUpdateAsync(updates => 
                updates.SetProperty(t => t.IsUsed, true), token);
    }
}