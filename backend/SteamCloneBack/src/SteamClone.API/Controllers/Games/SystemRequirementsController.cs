using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SteamClone.API.Controllers.Common;
using SteamClone.BLL.Services.GameService;
using SteamClone.DAL;
using SteamClone.Domain.Models.Games;
using SteamClone.Domain.ViewModels.Games;
using SteamClone.Domain.ViewModels.Games.Localizations;
using SteamClone.Domain.ViewModels.Games.SystemReq;

namespace SteamClone.API.Controllers.Games;

[ApiController]
[Route("Game/system-requirements")]
[Tags("Game System Requirements")]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
[Authorize(Policy = Settings.Roles.AdminOrManager)]
public class SystemRequirementsController(IGameService gameService) : BaseController
{
    [HttpPost]
    public async Task<IActionResult> AddSystemRequirementAsync([FromBody] CreateUpdateSystemReqVm model,
        CancellationToken cancellationToken)
    {
        var response = await gameService.AddSystemRequirementsAsync(model, cancellationToken);
        return GetResult(response);
    }
    
    [HttpDelete("{systemRequirementId}")]
    public async Task<IActionResult> DeleteSystemRequirementAsync([FromRoute] string systemRequirementId,
        CancellationToken cancellationToken)
    {
        var response = await gameService.DeleteSystemRequirementsAsync(systemRequirementId, cancellationToken);
        return GetResult(response);
    }
    
    [HttpPut("{systemRequirementId}")]
    public async Task<IActionResult> UpdateSystemRequirementAsync([FromRoute] string systemRequirementId,
        [FromBody] UpdateSystemReqVM model,
        CancellationToken cancellationToken)
    {
        var response =
            await gameService.UpdateSystemRequirementsAsync(systemRequirementId, model, cancellationToken);
        return GetResult(response);
    }
    
    [HttpGet("platforms-enums")]
    public IActionResult GetPlatformsAsync()
    {
        var platforms = Enum.GetValues<RequirementPlatform>()
            .Select(x => new { Name = x.ToString(), Value = (int)x })
            .ToList();

        return Ok(platforms);
    }
    
    [HttpGet("requirement-types-enums")]
    public IActionResult GetRequirementTypesAsync()
    {
        var requirementTypes = Enum.GetValues<RequirementType>()
            .Select(x => new { Name = x.ToString(), Value = (int)x })
            .ToList();

        return Ok(requirementTypes);
    }
}