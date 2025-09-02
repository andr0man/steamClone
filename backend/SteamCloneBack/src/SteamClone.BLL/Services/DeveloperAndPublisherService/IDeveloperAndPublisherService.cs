using SteamClone.BLL.Services.Common;
using SteamClone.Domain.ViewModels.DevelopersAndPublishers;

namespace SteamClone.BLL.Services.DeveloperAndPublisherService;

public interface IDeveloperAndPublisherService : IServiceCRUD<string, CreateDeveloperAndPublisherVM, UpdateDeveloperAndPublisherVM>
{
    
}