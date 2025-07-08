using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SteamClone.API.Controllers.Common;
using SteamClone.BLL.Services.PublisherService;
using SteamClone.DAL;
using SteamClone.Domain.ViewModels.Publishers;

namespace SteamClone.API.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
[Authorize(Roles = Settings.AdminRole)]
public class PublisherController(IPublisherService publisherService)
    : GenericController<string, CreatePublisherVM, UpdatePublisherVM>(publisherService)
{
    
}