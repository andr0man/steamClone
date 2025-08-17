using SteamClone.DAL.Data;
using SteamClone.DAL.Repositories.Common;
using SteamClone.Domain.Common.Interfaces;
using SteamClone.Domain.Models.Items;

namespace SteamClone.DAL.Repositories.UserItemRepository;

public class UserItemRepository(AppDbContext appDbContext, IUserProvider userProvider)
    : Repository<UserItem, string>(appDbContext, userProvider), IUserItemRepository
{
    public override async Task<IEnumerable<UserItem>> GetAllAsync(CancellationToken token) =>
        await GetAllAsync(token, x => x.Item!);

    public override async Task<UserItem?> GetByIdAsync(string id, CancellationToken token, bool asNoTracking = false) =>
        await GetByIdAsync(id, token, asNoTracking, x => x.Item!);
}