using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SteamClone.BLL.Services.UserGameLibraryService;

namespace SteamClone.API.Controllers;

[ApiController]
[Route("[controller]")]
[Tags("User Game Library")]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class UserGameLibraryController(IUserGameLibraryService userGameLibraryService) : BaseController
{
    [HttpGet("by-user")]
    public async Task<IActionResult> GetAllByUserAsync(CancellationToken cancellationToken = default) =>
        GetResult(await userGameLibraryService.GetAllByUserAsync(cancellationToken));

    [HttpPatch("switch-favorite-status/{gameId}")]
    public async Task<IActionResult> ChangeFavoriteStatusAsync(string gameId,
        CancellationToken cancellationToken = default) =>
        GetResult(await userGameLibraryService.ChangeFavoriteStatusAsync(gameId, cancellationToken));
}