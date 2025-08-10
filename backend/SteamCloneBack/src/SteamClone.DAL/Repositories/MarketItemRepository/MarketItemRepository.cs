using SteamClone.DAL.Data;
using SteamClone.DAL.Repositories.Common;
using SteamClone.Domain.Common.Interfaces;
using SteamClone.Domain.Models.Items;

namespace SteamClone.DAL.Repositories.MarketItemRepository;

public class MarketItemRepository(AppDbContext appDbContext, IUserProvider userProvider)
    : Repository<MarketItem, string>(appDbContext, userProvider), IMarketItemRepository
{
}