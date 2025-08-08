using SteamClone.DAL.Repositories.Common;
using SteamClone.Domain.Models.Items;

namespace SteamClone.DAL.Repositories.ItemRepository;

public interface IItemRepository : IRepository<Item, string>
{
    Task<bool> IsUniqueNameAsync(string name, CancellationToken token);
}