using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SteamClone.BLL.Services.GenreService;
using SteamClone.DAL;
using SteamClone.Domain.ViewModels.Games;

namespace SteamClone.API.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
[Authorize(Roles = Settings.AdminRole)]
public class GameGenreController(IGenreService genreService) : BaseController
{
    [HttpGet]
    public async Task<IActionResult> GetAllAsync(CancellationToken cancellationToken)
    {
        var response = await genreService.GetAllAsync(cancellationToken);
        return GetResult(response);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        var response = await genreService.GetByIdAsync(id, cancellationToken);
        return GetResult(response);
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] CreateUpdateGenreVM model, CancellationToken cancellationToken)
    {
        var response = await genreService.CreateAsync(model, cancellationToken);
        return GetResult(response);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateAsync(int id, [FromBody] CreateUpdateGenreVM model, CancellationToken cancellationToken)
    {
        var response = await genreService.UpdateAsync(id, model, cancellationToken);
        return GetResult(response);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteAsync(int id, CancellationToken cancellationToken)
    {
        var response = await genreService.DeleteAsync(id, cancellationToken);
        return GetResult(response);
    }
}