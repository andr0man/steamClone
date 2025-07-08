using SteamClone.BLL.Services.Common;
using SteamClone.Domain.ViewModels.Publishers;

namespace SteamClone.BLL.Services.PublisherService;

public interface IPublisherService : IServiceCRUD<string, CreatePublisherVM, UpdatePublisherVM>
{
    
}