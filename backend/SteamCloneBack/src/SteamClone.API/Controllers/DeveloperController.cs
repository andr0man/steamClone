using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SteamClone.API.Controllers.Common;
using SteamClone.BLL.Services.DeveloperService;
using SteamClone.DAL;
using SteamClone.Domain.ViewModels.Developers;

namespace SteamClone.API.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
[Authorize(Roles = Settings.AdminRole)]
public class DeveloperController(IDeveloperService developerService)
    : GenericController<string, CreateDeveloperVM, UpdateDeveloperVM>(developerService)
{
    
}