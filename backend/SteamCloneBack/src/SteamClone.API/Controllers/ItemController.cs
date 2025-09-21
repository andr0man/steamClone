using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SteamClone.API.Controllers.Common;
using SteamClone.BLL.Services.ItemService;
using SteamClone.DAL;
using SteamClone.Domain.ViewModels.Items;

namespace SteamClone.API.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
[Authorize(Policy = Settings.Roles.AdminOrManager)]
public class ItemController(IItemService itemService)
    : GenericController<string, CreateItemVM, UpdateItemVM>(itemService)
{
    [HttpPatch("update-image/{id}")]
    public async Task<IActionResult> UpdateImageAsync([FromRoute] string id, IFormFile image,
        CancellationToken cancellationToken)
    {
        var response = await itemService.UpdateImageAsync(id, image, cancellationToken);
        return GetResult(response);
    }

    [HttpGet("by-game/{gameId}")]
    public async Task<IActionResult> GetByGameIdAsync([FromRoute] string gameId, CancellationToken cancellationToken)
    {
        var response = await itemService.GetByGameIdAsync(gameId, cancellationToken);
        return GetResult(response);
    }
}