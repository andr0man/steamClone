using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SteamClone.API.Controllers.Common;
using SteamClone.BLL.Services.GenreService;
using SteamClone.DAL;
using SteamClone.Domain.ViewModels.Games.Genre;

namespace SteamClone.API.Controllers;

[ApiController]
[Route("game-genre")]
[Tags("Game Genre")]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
[Authorize(Roles = Settings.Roles.AdminRole)]
public class GameGenreController(IGenreService genreService)
    : GenericController<int, CreateUpdateGenreVM, CreateUpdateGenreVM>(genreService)
{
    [AllowAnonymous]
    [HttpGet]
    public override async Task<IActionResult> GetAllAsync(CancellationToken cancellationToken)
    {
        var response = await genreService.GetAllAsync(cancellationToken);
        return GetResult(response);
    }
}