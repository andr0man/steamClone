using SteamClone.DAL.Repositories.Common;
using SteamClone.Domain.Models.DevelopersAndPublishers;

namespace SteamClone.DAL.Repositories.DeveloperAndPublisherRepository;

public interface IDeveloperAndPublisherRepository : IRepository<DeveloperAndPublisher, string>
{
    public Task<bool> IsUniqueNameAsync(string name, CancellationToken token);
}