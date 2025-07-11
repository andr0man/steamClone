using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Pqc.Crypto.Lms;
using SteamClone.BLL.Services.UserService;
using SteamClone.DAL;

namespace SteamClone.API.Controllers;

[Route("users")]
[ApiController]
// [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
// [Authorize(Roles = $"{Settings.AdminRole}, {Settings.UserRole}")]
public class UsersController(IUserService userService) : BaseController
{
    [HttpGet("paged")]
    public async Task<IActionResult> GetPagedUsers([FromQuery] int page = 1, [FromQuery] int pageSize = 10, CancellationToken token = default)
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
}