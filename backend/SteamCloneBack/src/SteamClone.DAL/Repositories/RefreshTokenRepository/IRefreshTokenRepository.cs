using SteamClone.DAL.Models;

namespace SteamClone.DAL.Repositories.RefreshTokenRepository;

public interface IRefreshTokenRepository
{
    Task<RefreshToken?> GetRefreshTokenAsync(string refreshToken);
    Task<RefreshToken> Create(RefreshToken model);
    Task MakeAllRefreshTokensExpiredForUser(string userId);
}