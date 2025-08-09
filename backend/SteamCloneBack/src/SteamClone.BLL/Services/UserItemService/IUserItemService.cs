namespace SteamClone.BLL.Services.UserItemService;

public interface IUserItemService
{
    Task<ServiceResponse> GetAllAsync(CancellationToken token = default);
    Task<ServiceResponse> GetByIdAsync(string id, CancellationToken token = default);
    Task<ServiceResponse> GetByUserIdAsync(CancellationToken token = default);
}