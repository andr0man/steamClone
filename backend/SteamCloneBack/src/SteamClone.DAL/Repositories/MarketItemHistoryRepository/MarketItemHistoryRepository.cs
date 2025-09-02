using SteamClone.DAL.Data;
using SteamClone.DAL.Repositories.Common;
using SteamClone.Domain.Common.Interfaces;
using SteamClone.Domain.Models.Items;

namespace SteamClone.DAL.Repositories.MarketItemHistoryRepository;

public class MarketItemHistoryRepository(AppDbContext appDbContext, IUserProvider userProvider)
    : Repository<MarketItemHistory, string>(appDbContext, userProvider), IMarketItemHistoryRepository
{
}