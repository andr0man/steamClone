using Microsoft.EntityFrameworkCore;
using SteamClone.DAL.Data;
using SteamClone.DAL.Repositories.Common;
using SteamClone.Domain.Common.Interfaces;
using SteamClone.Domain.Models;
using SteamClone.Domain.Models.Auth;

namespace SteamClone.DAL.Repositories.RefreshTokenRepository;

public class RefreshTokenRepository(AppDbContext appDbContext, IUserProvider userProvider)
    : Repository<RefreshToken, string>(appDbContext, userProvider), IRefreshTokenRepository
{
    private readonly AppDbContext _appDbContext = appDbContext;

    public async Task<RefreshToken?> GetRefreshTokenAsync(string refreshToken, CancellationToken token)
    {
        var entity = await _appDbContext.RefreshTokens
            .FirstOrDefaultAsync(t => t.Token == refreshToken, token);

        return entity;
    }

    public async Task MakeAllRefreshTokensExpiredForUser(string userId, CancellationToken token)
    {
        await _appDbContext.RefreshTokens.Where(t => t.UserId == userId)
            .ExecuteUpdateAsync(updates =>
                updates.SetProperty(t => t.IsUsed, true), token);
    }
}