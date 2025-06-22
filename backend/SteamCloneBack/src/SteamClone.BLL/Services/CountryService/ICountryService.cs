using SteamClone.DAL.ViewModels.Countries;

namespace SteamClone.BLL.Services.CountryService;

public interface ICountryService
{
    Task<ServiceResponse> GetAllAsync(CancellationToken cancellationToken = default);
    Task<ServiceResponse> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<ServiceResponse> CreateAsync(CreateUpdateCountryVM model, CancellationToken cancellationToken = default);
    Task<ServiceResponse> UpdateAsync(int id, CreateUpdateCountryVM model, CancellationToken cancellationToken = default);
    Task<ServiceResponse> DeleteAsync(int id, CancellationToken cancellationToken = default);
}