namespace SteamClone.BLL.Services.UserGameLibraryService;

public interface IUserGameLibraryService
{
    public Task<ServiceResponse> GetAllByUserAsync(CancellationToken cancellationToken = default);
    // public Task<ServiceResponse> GetByGameIdAsync(string gameId, CancellationToken cancellationToken = default);
    public Task<ServiceResponse> ChangeFavoriteStatusAsync(string gameId, CancellationToken cancellationToken);
    Task<ServiceResponse> IsInLibraryAsync(string gameId, CancellationToken cancellationToken);
}