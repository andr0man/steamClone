using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SteamClone.API.Controllers.Common;
using SteamClone.BLL.Services.GameService;
using SteamClone.DAL;
using SteamClone.Domain.ViewModels.Games;

namespace SteamClone.API.Controllers.Games;

[ApiController]
[Route("[controller]")]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class GameController(IGameService gameService)
    : GenericController<string, CreateGameVM, UpdateGameVM>(gameService)
{
    [AllowAnonymous]
    [HttpGet]
    public override async Task<IActionResult> GetAllAsync(CancellationToken cancellationToken)
    {
        var response = await gameService.GetAllAsync(cancellationToken);
        return GetResult(response);
    }

    [Authorize(Policy = Settings.Roles.AdminOrManager)]
    [HttpPatch("update-cover-image/{gameId}")]
    public async Task<IActionResult> UpdateCoverImageAsync([FromRoute] string gameId, IFormFile coverImage,
        CancellationToken cancellationToken)
    {
        var response = await gameService.UpdateCoverImageAsync(gameId, coverImage, cancellationToken);
        return GetResult(response);
    }

    [Authorize(Policy = Settings.Roles.AdminOrManager)]
    [HttpPatch("update-screenshots-images/{gameId}")]
    public async Task<IActionResult> UpdateImages([FromRoute] string gameId,
        [FromForm] IFormFileCollection newImages,
        [FromForm] List<string> imagesToDelete,
        CancellationToken cancellationToken)
    {
        var response =
            await gameService.UpdateScreenshotsImagesAsync(gameId, newImages, imagesToDelete, cancellationToken);
        return GetResult(response);
    }

    [Authorize(Policy = Settings.Roles.AdminOrManager)]
    [HttpPatch("associate-user")]
    public async Task<IActionResult> AssociateUserAsync([FromQuery] string gameId, string userId,
        CancellationToken token)
    {
        var result = await gameService.AssociateUserAsync(gameId, userId, token);
        return GetResult(result);
    }

    [Authorize(Policy = Settings.Roles.AdminOrManager)]
    [HttpPatch("remove-associated-user")]
    public async Task<IActionResult> RemoveAssociatedUserAsync([FromQuery] string gameId,
        string userId, CancellationToken token)
    {
        var result =
            await gameService.RemoveAssociatedUserAsync(gameId, userId, token);
        return GetResult(result);
    }

    [Authorize(Policy = Settings.Roles.AdminOrManager)]
    [HttpGet("by-associated-user")]
    public async Task<IActionResult> GetByAssociatedUserIdAsync(CancellationToken token)
    {
        var result = await gameService.GetByAssociatedUserAsync(token);
        return GetResult(result);
    }

    [Authorize(Roles = Settings.Roles.AdminRole)]
    [HttpPatch("approve")]
    public async Task<IActionResult> ApproveAsync([FromQuery] string id, bool isApproved = true,
        CancellationToken token = default)
    {
        var result = await gameService.ApproveAsync(id, isApproved, token);
        return GetResult(result);
    }

    [Authorize(Roles = Settings.Roles.AdminRole)]
    [HttpGet("get-without-approval")]
    public async Task<IActionResult> GetWithoutApprovalAsync(CancellationToken token = default)
    {
        var result = await gameService.GetWithoutApprovalAsync(token);
        return GetResult(result);
    }

    [HttpPost("buy/{id}")]
    public async Task<IActionResult> BuyGameAsync([FromRoute] string id, CancellationToken token = default)
    {
        var result = await gameService.BuyGameAsync(id, token);
        return GetResult(result);
    }

    [HttpGet("is-game-bought/{gameId}")]
    public async Task<IActionResult> IsGameBoughtAsync([FromRoute] string gameId, CancellationToken token = default)
    {
        var result = await gameService.IsGameBoughtAsync(gameId, token);
        return GetResult(result);
    }

    [HttpGet("get-associated-users/{gameId}")]
    public async Task<IActionResult> GetAssociatedUsersAsync(string gameId, CancellationToken token = default)
    {
        var result = await gameService.GetAssociatedUsersAsync(gameId, token);
        return GetResult(result);
    }

    [HttpGet("is-owner/{gameId}")]
    public async Task<IActionResult> IsOwnerAsync([FromRoute] string gameId, CancellationToken token = default)
    {
        var result = await gameService.IsGameOwnerAsync(gameId, token);
        return GetResult(result);
    }
}