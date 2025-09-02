using SteamClone.Domain.Models.Wishlists;

namespace SteamClone.DAL.Repositories.WishlistRepository;

public interface IWishlistRepository
{
    Task<Wishlist> CreateAsync(Wishlist wishlist, CancellationToken cancellationToken);
    Task<Wishlist> DeleteAsync(Wishlist wishlist, CancellationToken cancellationToken);
    Task MoveAsync(string userId, string gameId, bool isMoveUp = true, CancellationToken cancellationToken = default);
    Task MoveToPositionAsync(string userId, string gameId, int position, CancellationToken cancellationToken);
    Task<List<Wishlist>> GetAllByUserIdAsync(string userId, CancellationToken cancellationToken);
    Task<Wishlist?> GetByUserIdAndGameIdAsync(string userId, string gameId, CancellationToken cancellationToken);
}