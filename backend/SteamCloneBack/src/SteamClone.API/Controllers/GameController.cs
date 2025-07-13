using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SteamClone.API.Controllers.Common;
using SteamClone.BLL.Services.GameService;
using SteamClone.DAL;
using SteamClone.Domain.Models.Games;
using SteamClone.Domain.ViewModels.Games;
using SteamClone.Domain.ViewModels.Games.SystemReq;

namespace SteamClone.API.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
[Authorize(Roles = $"{Settings.AdminRole}, {Settings.UserRole}")]
public class GameController(IGameService gameService)
    : GenericController<string, CreateGameVM, UpdateGameVM>(gameService)
{
    [HttpPost("system-requirements/add/{gameId}")]
    public async Task<IActionResult> AddSystemRequirementAsync(string gameId, [FromBody] SystemReqCreateUpdateVM model,
        CancellationToken cancellationToken)
    {
        var response = await gameService.AddSystemRequirementsAsync(gameId, model, cancellationToken);
        return GetResult(response);
    }

    [HttpDelete("system-requirements/delete")]
    public async Task<IActionResult> DeleteSystemRequirementAsync([FromQuery] string gameId, string systemRequirementId,
        CancellationToken cancellationToken)
    {
        var response = await gameService.DeleteSystemRequirementsAsync(gameId, systemRequirementId, cancellationToken);
        return GetResult(response);
    }

    [HttpPut("system-requirements/update")]
    public async Task<IActionResult> UpdateSystemRequirementAsync([FromQuery] string gameId, string systemRequirementId,
        [FromBody] SystemReqCreateUpdateVM model,
        CancellationToken cancellationToken)
    {
        var response =
            await gameService.UpdateSystemRequirementsAsync(gameId, systemRequirementId, model, cancellationToken);
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
}