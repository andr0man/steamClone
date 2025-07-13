using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SteamClone.API.Controllers.Common;
using SteamClone.BLL.Services.GenreService;
using SteamClone.DAL;
using SteamClone.Domain.ViewModels.Games.Genre;

namespace SteamClone.API.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
[Authorize(Roles = Settings.AdminRole)]
public class GameGenreController(IGenreService genreService)
    : GenericController<int, CreateUpdateGenreVM, CreateUpdateGenreVM>(genreService)
{
    
}