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

namespace SteamClone.API.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
[Authorize(Roles = $"{Settings.AdminRole}, {Settings.ManagerRole}")]
public class GameController(IGameService gameService)
    : GenericController<string, CreateGameVM, UpdateGameVM>(gameService)
{
    [HttpPost("system-requirements")]
    public async Task<IActionResult> AddSystemRequirementAsync([FromBody] CreateUpdateSystemReqVm model,
        CancellationToken cancellationToken)
    {
        var response = await gameService.AddSystemRequirementsAsync(model, cancellationToken);
        return GetResult(response);
    }

    [HttpDelete("system-requirements/{systemRequirementId}")]
    public async Task<IActionResult> DeleteSystemRequirementAsync([FromRoute] string systemRequirementId,
        CancellationToken cancellationToken)
    {
        var response = await gameService.DeleteSystemRequirementsAsync(systemRequirementId, cancellationToken);
        return GetResult(response);
    }

    [HttpPut("system-requirements/{systemRequirementId}")]
    public async Task<IActionResult> UpdateSystemRequirementAsync([FromRoute] string systemRequirementId,
        [FromBody] UpdateSystemReqVM model,
        CancellationToken cancellationToken)
    {
        var response =
            await gameService.UpdateSystemRequirementsAsync(systemRequirementId, model, cancellationToken);
        return GetResult(response);
    }

    [HttpGet("system-requirements/platforms-enums")]
    public IActionResult GetPlatformsAsync()
    {
        var platforms = Enum.GetValues<RequirementPlatform>()
            .Select(x => new { Name = x.ToString(), Value = (int)x })
            .ToList();

        return Ok(platforms);
    }

    [HttpGet("system-requirements/requirement-types-enums")]
    public IActionResult GetRequirementTypesAsync()
    {
        var requirementTypes = Enum.GetValues<RequirementType>()
            .Select(x => new { Name = x.ToString(), Value = (int)x })
            .ToList();

        return Ok(requirementTypes);
    }

    [HttpPatch("update-cover-image/{gameId}")]
    public async Task<IActionResult> UpdateCoverImageAsync([FromRoute] string gameId, IFormFile coverImage,
        CancellationToken cancellationToken)
    {
        var response = await gameService.UpdateCoverImageAsync(gameId, coverImage, cancellationToken);
        return GetResult(response);
    }
    
    [HttpPatch("update-screenshots-images/{gameId}")]
    public async Task<IActionResult> UpdateImages([FromRoute] string gameId,
        [FromForm] IFormFileCollection newImages,
        [FromForm] List<string> imagesToDelete,
        CancellationToken cancellationToken)
    {
        var response = await gameService.UpdateScreenshotsImagesAsync(gameId, newImages, imagesToDelete, cancellationToken);
        return GetResult(response);
    }
    
    [HttpPost("localization")]
    public async Task<IActionResult> AddLocalizationAsync([FromBody] CreateLocalizationVM model,
        CancellationToken cancellationToken)
    {
        var response = await gameService.AddLocalizationAsync(model, cancellationToken);
        return GetResult(response);
    }
    
    [HttpDelete("localization/{localizationId}")] 
    public async Task<IActionResult> DeleteLocalizationAsync([FromRoute] string localizationId,
        CancellationToken cancellationToken)
    {
        var response = await gameService.DeleteLocalizationAsync(localizationId, cancellationToken);
        return GetResult(response);
    }
    
    [HttpPut("localization/{localizationId}")] 
    public async Task<IActionResult> UpdateLocalizationAsync([FromRoute] string localizationId,
        [FromBody] UpdateLocalizationVM model,
        CancellationToken cancellationToken)
    {
        var response = await gameService.UpdateLocalizationAsync(localizationId, model, cancellationToken);
        return GetResult(response);
    }
    
    [HttpPatch("associate-user")]
    public async Task<IActionResult> AssociateUserAsync([FromQuery] string gameId, string userId,
        CancellationToken token)
    {
        var result = await gameService.AssociateUserAsync(gameId, userId, token);
        return GetResult(result);
    }

    [HttpPatch("remove-associated-user")]
    public async Task<IActionResult> RemoveAssociatedUserAsync([FromQuery] string gameId,
        string userId, CancellationToken token)
    {
        var result =
            await gameService.RemoveAssociatedUserAsync(gameId, userId, token);
        return GetResult(result);
    }

    [HttpGet("by-associated-user")]
    public async Task<IActionResult> GetByAssociatedUserIdAsync(CancellationToken token)
    {
        var result = await gameService.GetByAssociatedUserAsync(token);
        return GetResult(result);
    }
    
    [Authorize(Roles = Settings.AdminRole)]
    [HttpPatch("approve")]
    public async Task<IActionResult> ApproveAsync([FromQuery] string id, bool isApproved = true, CancellationToken token = default)
    {
        var result = await gameService.ApproveAsync(id, isApproved, token);
        return GetResult(result);
    }
    
    [Authorize(Roles = Settings.AdminRole)]
    [HttpGet("get-without-approval")]
    public async Task<IActionResult> GetWithoutApprovalAsync(CancellationToken token = default)
    {
        var result = await gameService.GetWithoutApprovalAsync(token);
        return GetResult(result);
    }
}