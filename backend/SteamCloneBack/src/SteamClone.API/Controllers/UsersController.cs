using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SteamClone.BLL.Services;
using SteamClone.BLL.Services.UserService;
using SteamClone.DAL.Repositories.BalanceRepository;
using SteamClone.Domain.ViewModels.Users;

namespace SteamClone.API.Controllers;

[Route("[controller]")]
[ApiController]
// [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
// [Authorize(Roles = $"{Settings.AdminRole}, {Settings.UserRole}")]
public class UsersController(IUserService userService, IBalanceRepository balanceRepository) : BaseController
{
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id, CancellationToken token)
    {
        var response = await userService.GetByIdAsync(id, token);
        return GetResult(response);
    }

    [HttpGet("by-email/{email}")]
    public async Task<IActionResult> GetByEmail(string email, CancellationToken token)
    {
        var response = await userService.GetByEmailAsync(email, token);
        return GetResult(response);
    }

    [HttpGet("by-nickname/{nickname}")]
    public async Task<IActionResult> GetByNickname(string nickname, CancellationToken token)
    {
        var response = await userService.GetByUserNicknameAsync(nickname, token);
        return GetResult(response);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken token)
    {
        var response = await userService.GetAllAsync(token);
        return GetResult(response);
    }

    [HttpGet("paged")]
    public async Task<IActionResult> GetPagedUsers([FromQuery] int page = 1, [FromQuery] int pageSize = 10,
        CancellationToken token = default)
    {
        var response = await userService.GetAllAsync(page, pageSize, token);
        return GetResult(response);
    }

    [HttpGet("role/{roleName}")]
    public async Task<IActionResult> GetUsersByRoleAsync(string roleName, CancellationToken token)
    {
        var response = await userService.GetUsersByRoleAsync(roleName, token);
        return GetResult(response);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateUserVM model, CancellationToken token)
    {
        var response = await userService.CreateAsync(model, token);
        return GetResult(response);
    }

    [Authorize]
    [HttpPatch]
    public async Task<IActionResult> Update([FromBody] UpdateUserVM model, CancellationToken token)
    {
        var response = await userService.UpdateAsync(model, token);
        return GetResult(response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, CancellationToken token)
    {
        var response = await userService.DeleteAsync(id, token);
        return GetResult(response);
    }

    [Authorize]
    [HttpGet("profile")]
    public async Task<IActionResult> GetCurrentUserAsync(CancellationToken token)
    {
        var userId = User.FindFirst("id")?.Value;

        if (string.IsNullOrEmpty(userId))
            return Unauthorized("User ID not found in token.");

        var result = await userService.GetProfileAsync(userId, token);
        return GetResult(result);
    }

    [Authorize]
    [HttpPost("avatar")]
    public async Task<IActionResult> UploadUserAvatar([FromForm] UserImageVM model, CancellationToken token)
    {
        var result = await userService.AddImageFromUserAsync(model, token);
        return GetResult(result);
    }

    [Authorize]
    [HttpGet("balance")]
    public async Task<IActionResult> GetBalanceAsync(CancellationToken token)
    {
        var userId = User.FindFirst("id")?.Value;

        if (string.IsNullOrEmpty(userId))
            return Unauthorized("User ID not found in token.");

        var result = await balanceRepository.GetByUserAsync(userId, token);
        return GetResult(ServiceResponse.OkResponse("Balance retrieved successfully", result));
    }
}