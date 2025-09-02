using Microsoft.AspNetCore.Mvc;
using SteamClone.BLL.Services.UserItemService;
using SteamClone.Domain.ViewModels.Items.UserItem;

namespace SteamClone.API.Controllers;

[ApiController]
[Route("user-item")]
[Tags("User Item")]
public class UserItemController(IUserItemService userItemService) : BaseController
{
    [HttpGet]
    public async Task<IActionResult> GetAllAsync(CancellationToken token = default) =>
        GetResult(await userItemService.GetAllAsync(token));
    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetByIdAsync(string id, CancellationToken token = default) =>
        GetResult(await userItemService.GetByIdAsync(id, token));
    
    [HttpGet("by-user")]
    public async Task<IActionResult> GetByUserIdAsync(CancellationToken token = default) =>
        GetResult(await userItemService.GetByUserIdAsync(token));
    
    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] CreateUserItemVM model, CancellationToken token = default) =>
        GetResult(await userItemService.CreateAsync(model, token));
}