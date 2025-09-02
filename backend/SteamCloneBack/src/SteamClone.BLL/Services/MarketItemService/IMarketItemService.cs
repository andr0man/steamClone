using SteamClone.Domain.ViewModels.Items.MarketItems;

namespace SteamClone.BLL.Services.MarketItemService;

public interface IMarketItemService
{
    Task<ServiceResponse> GetAllAsync(CancellationToken cancellationToken = default);
    Task<ServiceResponse> GetByIdAsync(string id, CancellationToken cancellationToken = default);
    Task<ServiceResponse> GetHistoryAsync(CancellationToken cancellationToken = default);
    Task<ServiceResponse> PutUpForSaleAsync(CreateMarketItemVM model, CancellationToken cancellationToken = default);
    Task<ServiceResponse> DeleteAsync(string marketItemId, CancellationToken cancellationToken = default);
    Task<ServiceResponse> BuyAsync(string marketItemId, CancellationToken cancellationToken = default);
}