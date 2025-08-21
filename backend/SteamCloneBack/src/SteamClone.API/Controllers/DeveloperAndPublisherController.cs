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
[Tags("Developer And Publisher")]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
[Authorize(Policy = Settings.Roles.AdminOrManager)]
public class DeveloperAndPublisherController(IDeveloperAndPublisherService developerAndPublisherService)
    : GenericController<string, CreateDeveloperAndPublisherVM, UpdateDeveloperAndPublisherVM>(
        developerAndPublisherService)
{
    [HttpPatch("associate-user")]
    public async Task<IActionResult> AssociateUserAsync([FromQuery] string developerAndPublisherId, string userId,
        CancellationToken token)
    {
        var result = await developerAndPublisherService.AssociateUserAsync(developerAndPublisherId, userId, token);
        return GetResult(result);
    }

    [HttpPatch("remove-associated-user")]
    public async Task<IActionResult> RemoveAssociatedUserAsync([FromQuery] string developerAndPublisherId,
        string userId, CancellationToken token)
    {
        var result =
            await developerAndPublisherService.RemoveAssociatedUserAsync(developerAndPublisherId, userId, token);
        return GetResult(result);
    }

    [HttpGet("by-associated-user")]
    public async Task<IActionResult> GetByAssociatedUserIdAsync(CancellationToken token)
    {
        var result = await developerAndPublisherService.GetByAssociatedUserAsync(token);
        return GetResult(result);
    }
    
    [Authorize(Roles = Settings.Roles.AdminRole)]
    [HttpPatch("approve")]
    public async Task<IActionResult> ApproveAsync([FromQuery] string id, bool isApproved = true, CancellationToken token = default)
    {
        var result = await developerAndPublisherService.ApproveAsync(id, isApproved, token);
        return GetResult(result);
    }
    
    [Authorize(Roles = Settings.Roles.AdminRole)]
    [HttpGet("get-without-approval")]
    public async Task<IActionResult> GetWithoutApprovalAsync(CancellationToken token = default)
    {
        var result = await developerAndPublisherService.GetWithoutApprovalAsync(token);
        return GetResult(result);
    }
}