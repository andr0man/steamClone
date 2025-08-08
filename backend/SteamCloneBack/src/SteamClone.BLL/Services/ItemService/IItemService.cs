using SteamClone.BLL.Services.Common;
using SteamClone.Domain.ViewModels.Items;

namespace SteamClone.BLL.Services.ItemService;

public interface IItemService : IServiceCRUD<string, CreateItemVM, UpdateItemVM>
{
    
}