using SteamClone.DAL.Repositories.Common;
using SteamClone.Domain.Models.Items;

namespace SteamClone.DAL.Repositories.MarketItemRepository;

public interface IMarketItemRepository : IRepository<MarketItem, string>
{
    Task<bool> IsUserListedItemAsync(string userId, string userItemId, CancellationToken token);
}