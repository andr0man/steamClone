using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SteamClone.API.Controllers.Common;
using SteamClone.BLL.Services.GameService;
using SteamClone.DAL;
using SteamClone.Domain.ViewModels.Games;
using SteamClone.Domain.ViewModels.Games.Localizations;

namespace SteamClone.API.Controllers.Games;

[ApiController]
[Route("Game/localization")]
[Tags("Game Localization")]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
[Authorize(Policy = Settings.Roles.AdminOrManager)]
public class LocalizationController(IGameService gameService) : BaseController
{
    [HttpPost]
    public async Task<IActionResult> AddLocalizationAsync([FromBody] CreateLocalizationVM model,
        CancellationToken cancellationToken)
    {
        var response = await gameService.AddLocalizationAsync(model, cancellationToken);
        return GetResult(response);
    }
    
    [HttpDelete("{localizationId}")]
    public async Task<IActionResult> DeleteLocalizationAsync([FromRoute] string localizationId,
        CancellationToken cancellationToken)
    {
        var response = await gameService.DeleteLocalizationAsync(localizationId, cancellationToken);
        return GetResult(response);
    }
    
    [HttpPut("{localizationId}")]
    public async Task<IActionResult> UpdateLocalizationAsync([FromRoute] string localizationId,
        [FromBody] UpdateLocalizationVM model,
        CancellationToken cancellationToken)
    {
        var response = await gameService.UpdateLocalizationAsync(localizationId, model, cancellationToken);
        return GetResult(response);
    }
}