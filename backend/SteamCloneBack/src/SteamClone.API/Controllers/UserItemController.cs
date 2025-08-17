using Microsoft.AspNetCore.Mvc;
using SteamClone.BLL.Services.UserItemService;

namespace SteamClone.API.Controllers;

[ApiController]
[Route("[controller]")]
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
}