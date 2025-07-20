using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SteamClone.API.Controllers.Common;
using SteamClone.BLL.Services.CountryService;
using SteamClone.Domain.ViewModels.Countries;

namespace SteamClone.API.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class CountryController(ICountryService countryService)
    : GenericController<int, CreateUpdateCountryVM, CreateUpdateCountryVM>(countryService)
{
    
}