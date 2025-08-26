namespace SteamClone.BLL.Services.WishlistService;

public interface IWishlistService
{
    Task<ServiceResponse> GetAllByUserAsync(CancellationToken token);
    Task<ServiceResponse> AddAsync(string gameId, CancellationToken token);
    Task<ServiceResponse> RemoveAsync(string gameId, CancellationToken token);
    Task<ServiceResponse> MoveAsync(string gameId, bool isMoveUp, CancellationToken token);
    Task<ServiceResponse> MoveToPositionAsync(string gameId, int position, CancellationToken token);
}