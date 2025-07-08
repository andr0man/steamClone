using SteamClone.BLL.Services.Common;
using SteamClone.Domain.ViewModels.Developers;

namespace SteamClone.BLL.Services.DeveloperService;

public interface IDeveloperService : IServiceCRUD<string, CreateDeveloperVM, UpdateDeveloperVM>
{
    
}