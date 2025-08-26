using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SteamClone.API.Controllers.Common;
using SteamClone.BLL.Services.ReviewService;
using SteamClone.DAL;
using SteamClone.Domain.ViewModels.Games.Reviews;

namespace SteamClone.API.Controllers;

[ApiController]
[Route("game-review")]
[Tags("Game Review")]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
[Authorize(Roles = $"{Settings.Roles.AdminRole}, {Settings.Roles.UserRole}")]
public class GameReviewController(IReviewService reviewService)
    : GenericController<string, CreateReviewVM, UpdateReviewVM>(reviewService)
{
    [HttpGet("filter")]
    public async Task<IActionResult> GetByGameIdAsync([FromQuery] FilterReviewVM filter, CancellationToken cancellationToken = default)
    {
        var response = await reviewService.GetByFilterAsync(filter, cancellationToken);
        return GetResult(response);
    }
}