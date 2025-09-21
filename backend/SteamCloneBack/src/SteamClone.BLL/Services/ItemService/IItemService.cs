using Microsoft.AspNetCore.Http;
using SteamClone.BLL.Services.Common;
using SteamClone.Domain.ViewModels.Items;

namespace SteamClone.BLL.Services.ItemService;

public interface IItemService : IServiceCRUD<string, CreateItemVM, UpdateItemVM>
{
    Task<ServiceResponse> UpdateImageAsync(string id, IFormFile image, CancellationToken cancellationToken = default);
    Task<ServiceResponse> GetByGameIdAsync(string gameId, CancellationToken cancellationToken);
}