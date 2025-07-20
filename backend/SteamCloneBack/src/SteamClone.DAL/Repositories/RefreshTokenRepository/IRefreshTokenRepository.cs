using SteamClone.DAL.Repositories.Common;
using SteamClone.Domain.Models;
using SteamClone.Domain.Models.Auth;

namespace SteamClone.DAL.Repositories.RefreshTokenRepository;

public interface IRefreshTokenRepository : IRepository<RefreshToken, string>
{
    Task<RefreshToken?> GetRefreshTokenAsync(string refreshToken, CancellationToken token);
    Task MakeAllRefreshTokensExpiredForUser(string userId, CancellationToken token);
}