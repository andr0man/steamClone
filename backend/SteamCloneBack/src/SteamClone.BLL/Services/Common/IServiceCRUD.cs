namespace SteamClone.BLL.Services.Common;

public interface IServiceCRUD<in TKey, TCreateVM, TUpdateVM>
{
    Task<ServiceResponse> GetAllAsync(CancellationToken cancellationToken = default);
    Task<ServiceResponse> GetByIdAsync(TKey id, CancellationToken cancellationToken = default);
    Task<ServiceResponse> CreateAsync(TCreateVM model, CancellationToken cancellationToken = default);
    Task<ServiceResponse> UpdateAsync(TKey id, TUpdateVM model, CancellationToken cancellationToken = default);
    Task<ServiceResponse> DeleteAsync(TKey id, CancellationToken cancellationToken = default);
}