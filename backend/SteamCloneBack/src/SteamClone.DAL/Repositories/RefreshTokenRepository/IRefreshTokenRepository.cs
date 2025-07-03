using SteamClone.Domain.Models;

namespace SteamClone.DAL.Repositories.RefreshTokenRepository;

public interface IRefreshTokenRepository
{
    Task<RefreshToken?> GetRefreshTokenAsync(string refreshToken, CancellationToken token);
    Task<RefreshToken> Create(RefreshToken model, CancellationToken token);
    Task MakeAllRefreshTokensExpiredForUser(string userId, CancellationToken token);
}