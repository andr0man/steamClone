using Microsoft.EntityFrameworkCore;
using SteamClone.DAL.Data;
using SteamClone.DAL.Repositories.Common;
using SteamClone.Domain.Common.Interfaces;
using SteamClone.Domain.Models.Items;

namespace SteamClone.DAL.Repositories.MarketItemRepository;

public class MarketItemRepository(AppDbContext appDbContext, IUserProvider userProvider)
    : Repository<MarketItem, string>(appDbContext, userProvider), IMarketItemRepository
{
    private readonly AppDbContext _appDbContext = appDbContext;

    public Task<bool> IsUserListedItemAsync(string userId, string userItemId, CancellationToken token)
    {
        return _appDbContext.MarketItems.AnyAsync(m => m.CreatedBy == userId && m.UserItemId == userItemId && !m.IsSold, token);
    }
}