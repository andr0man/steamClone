using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SteamClone.BLL.Services.UserService;
using SteamClone.DAL;

namespace SteamClone.API.Controllers;

[Route("users")]
[ApiController]
// [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
// [Authorize(Roles = $"{Settings.AdminRole}, {Settings.UserRole}")]
public class UsersController(IUserService userService) : BaseController
{
} 