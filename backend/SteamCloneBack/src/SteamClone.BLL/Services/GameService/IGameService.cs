using Microsoft.AspNetCore.Http;
using SteamClone.BLL.Services.Common;
using SteamClone.Domain.ViewModels.Games;
using SteamClone.Domain.ViewModels.Games.Localizations;
using SteamClone.Domain.ViewModels.Games.SystemReq;

namespace SteamClone.BLL.Services.GameService;

public interface IGameService : IServiceCRUD<string, CreateGameVM, UpdateGameVM>
{
    Task<ServiceResponse> AddSystemRequirementsAsync(CreateUpdateSystemReqVm model,
        CancellationToken cancellationToken);

    Task<ServiceResponse> DeleteSystemRequirementsAsync(string systemRequirementId,
        CancellationToken cancellationToken);

    Task<ServiceResponse> UpdateSystemRequirementsAsync(string systemRequirementId,
        UpdateSystemReqVM model, CancellationToken cancellationToken);

    Task<ServiceResponse> UpdateCoverImageAsync(string gameId, IFormFile coverImage,
        CancellationToken cancellationToken);

    Task<ServiceResponse> UpdateScreenshotsImagesAsync(string gameId, IFormFileCollection newScreenshots,
        List<string> screenshotsToDelete, CancellationToken cancellationToken);

    Task<ServiceResponse> AddLocalizationAsync(CreateLocalizationVM model,
        CancellationToken cancellationToken);

    Task<ServiceResponse> UpdateLocalizationAsync(string localizationId, UpdateLocalizationVM model,
        CancellationToken cancellationToken);

    Task<ServiceResponse> DeleteLocalizationAsync(string localizationId,
        CancellationToken cancellationToken);
}