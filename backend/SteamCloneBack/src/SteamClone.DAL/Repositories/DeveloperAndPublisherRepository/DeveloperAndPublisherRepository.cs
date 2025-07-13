using Microsoft.EntityFrameworkCore;
using SteamClone.DAL.Data;
using SteamClone.DAL.Repositories.Common;
using SteamClone.Domain.Common.Interfaces;
using SteamClone.Domain.Models.DevelopersAndPublishers;

namespace SteamClone.DAL.Repositories.DeveloperAndPublisherRepository;

public class DeveloperAndPublisherRepository(AppDbContext appDbContext, IUserProvider userProvider)
    : Repository<DeveloperAndPublisher, string>(appDbContext, userProvider), IDeveloperAndPublisherRepository
{
    private readonly AppDbContext _appDbContext = appDbContext;

    public async Task<bool> IsUniqueNameAsync(string name, CancellationToken token)
    {
        return await _appDbContext.DevelopersAndPublishers.FirstOrDefaultAsync(g => g.Name == name, token) == null;
    }
}