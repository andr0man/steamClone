using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SteamClone.API.Controllers.Common;
using SteamClone.BLL.Services.CountryService;
using SteamClone.BLL.Services.LanguageService;
using SteamClone.Domain.ViewModels.Countries;
using SteamClone.Domain.ViewModels.Languages;

namespace SteamClone.API.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class LanguageController(ILanguageService languageService)
    : GenericController<int, CreateUpdateLanguageVM, CreateUpdateLanguageVM>(languageService)
{
    [AllowAnonymous]
    [HttpGet]
    public override async Task<IActionResult> GetAllAsync(CancellationToken cancellationToken)
    {
        var response = await languageService.GetAllAsync(cancellationToken);
        return GetResult(response);
    }
}