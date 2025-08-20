using SteamClone.Domain.Models.Auth.Users;
using SteamClone.Domain.Models.UserGameLibraries;

namespace SteamClone.DAL.Repositories.UserGameLibraryRepository;

public interface IUserGameLibraryRepository
{
    Task<UserGameLibrary?> CreateAsync(UserGameLibrary userGameLibrary, CancellationToken token);
    Task<UserGameLibrary?> UpdateAsync(UserGameLibrary userGameLibrary, CancellationToken token);
    Task<UserGameLibrary?> DeleteAsync(string userId, string gameId, CancellationToken token);
    Task<UserGameLibrary?> GetAsync(string userId, string gameId, CancellationToken token,
        bool asNoTracking = false);
    Task<List<UserGameLibrary>> GetByUserIdAsync(string userId, CancellationToken token);
    // Task<List<UserGameLibrary>> GetByFilterAsync(FilterUserGameLibrary filter, CancellationToken token>
}