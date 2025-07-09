using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SteamClone.API.Controllers.Common;
using SteamClone.BLL.Services.DeveloperAndPublisherService;
using SteamClone.DAL;
using SteamClone.Domain.ViewModels.DevelopersAndPublishers;

namespace SteamClone.API.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
[Authorize(Roles = Settings.AdminRole)]
public class DeveloperAndPublisherController(IDeveloperAndPublisherService developerAndPublisherService)
    : GenericController<string, CreateDeveloperAndPublisherVM, UpdateDeveloperAndPublisherVM>(developerAndPublisherService)
{
    
}