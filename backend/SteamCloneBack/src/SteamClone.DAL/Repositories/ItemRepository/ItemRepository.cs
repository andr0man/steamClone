using Microsoft.EntityFrameworkCore;
using SteamClone.DAL.Data;
using SteamClone.DAL.Repositories.Common;
using SteamClone.Domain.Common.Interfaces;
using SteamClone.Domain.Models.Items;

namespace SteamClone.DAL.Repositories.ItemRepository;

public class ItemRepository(AppDbContext appDbContext, IUserProvider userProvider)
    : Repository<Item, string>(appDbContext, userProvider), IItemRepository
{
    private readonly AppDbContext _appDbContext = appDbContext;
    public async Task<bool> IsUniqueNameAsync(string name, CancellationToken token)
    {
        return await _appDbContext.Items.FirstOrDefaultAsync(g => g.Name == name, token) == null;
    }
}