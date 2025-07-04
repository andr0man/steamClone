using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SteamClone.BLL.Services.GameService;
using SteamClone.DAL;
using SteamClone.Domain.ViewModels.Games;

namespace SteamClone.API.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
[Authorize(Roles = $"{Settings.AdminRole}, {Settings.UserRole}")]
public class GameController(IGameService gameService) : BaseController
{
    [HttpGet]
    public async Task<IActionResult> GetAllAsync(CancellationToken cancellationToken)
    {
        var response = await gameService.GetAllAsync(cancellationToken);
        return GetResult(response);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetByIdAsync(string id, CancellationToken cancellationToken)
    {
        var response = await gameService.GetByIdAsync(id, cancellationToken);
        return GetResult(response);
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] CreateGameVM model, CancellationToken cancellationToken)
    {
        var response = await gameService.CreateAsync(model, cancellationToken);
        return GetResult(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAsync(string id, [FromBody] UpdateGameVM model, CancellationToken cancellationToken)
    {
        var response = await gameService.UpdateAsync(id, model, cancellationToken);
        return GetResult(response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAsync(string id, CancellationToken cancellationToken)
    {
        var response = await gameService.DeleteAsync(id, cancellationToken);
        return GetResult(response);
    }
}