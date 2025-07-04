using SteamClone.BLL.Services.Common;
using SteamClone.Domain.ViewModels.Games;
using SteamClone.Domain.ViewModels.Games.SystemReq;

namespace SteamClone.BLL.Services.GameService;

public interface IGameService : IServiceCRUD<string, CreateGameVM, UpdateGameVM>
{
    Task<ServiceResponse> AddSystemRequirementsAsync(string gameId, SystemReqCreateUpdateVM model, CancellationToken cancellationToken);
    Task<ServiceResponse> DeleteSystemRequirementsAsync(string gameId, string systemRequirementId, CancellationToken cancellationToken);
    Task<ServiceResponse> UpdateSystemRequirementsAsync(string gameId, string systemRequirementId, SystemReqCreateUpdateVM model, CancellationToken cancellationToken);
}