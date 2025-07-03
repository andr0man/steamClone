using SteamClone.Domain.ViewModels.Games;

namespace SteamClone.BLL.Services.GenreService;

public interface IGenreService
{
    Task<ServiceResponse> GetAllAsync(CancellationToken cancellationToken = default);
    Task<ServiceResponse> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<ServiceResponse> CreateAsync(CreateUpdateGenreVM model, CancellationToken cancellationToken = default);
    Task<ServiceResponse> UpdateAsync(int id, CreateUpdateGenreVM model, CancellationToken cancellationToken = default);
    Task<ServiceResponse> DeleteAsync(int id, CancellationToken cancellationToken = default);
}