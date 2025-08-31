using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SteamClone.BLL.Services.WishlistService;

namespace SteamClone.API.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class WishlistController(IWishlistService wishlistService) : BaseController
{
    [HttpGet("by-user")]
    public async Task<IActionResult> GetByUserIdAsync(CancellationToken token = default) =>
        GetResult(await wishlistService.GetAllByUserAsync(token));
    
    [HttpPost]
    public async Task<IActionResult> CreateAsync(string gameId, CancellationToken token = default) =>
        GetResult(await wishlistService.AddAsync(gameId, token));
    
    [HttpDelete]
    public async Task<IActionResult> DeleteAsync(string gameId, CancellationToken token = default) =>
        GetResult(await wishlistService.RemoveAsync(gameId, token));
    
    [HttpPatch("move")]
    public async Task<IActionResult> MoveAsync(string gameId, bool isMoveUp = true, CancellationToken token = default) =>
        GetResult(await wishlistService.MoveAsync(gameId, isMoveUp, token));
    
    [HttpPatch("move-to-position")]
    public async Task<IActionResult> MoveToPositionAsync(string gameId, int position, CancellationToken token = default) =>
        GetResult(await wishlistService.MoveToPositionAsync(gameId, position, token));
    
    [HttpGet("is-in-wishlist")]
    public async Task<IActionResult> IsInWishlistAsync(string gameId, CancellationToken token = default) =>
        GetResult(await wishlistService.IsInWishlistAsync(gameId, token));
}