using Microsoft.AspNetCore.Mvc;
using SteamClone.BLL.Services.CountryService;
using SteamClone.Domain.ViewModels.Countries;

namespace SteamClone.API.Controllers;

[ApiController]
[Route("[controller]")]
public class CountryController(ICountryService countryService) : BaseController
{
    [HttpGet]
    public async Task<IActionResult> GetAllAsync(CancellationToken cancellationToken)
    {
        var response = await countryService.GetAllAsync(cancellationToken);
        return GetResult(response);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        var response = await countryService.GetByIdAsync(id, cancellationToken);
        return GetResult(response);
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] CreateUpdateCountryVM model, CancellationToken cancellationToken)
    {
        var response = await countryService.CreateAsync(model, cancellationToken);
        return GetResult(response);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateAsync(int id, [FromBody] CreateUpdateCountryVM model, CancellationToken cancellationToken)
    {
        var response = await countryService.UpdateAsync(id, model, cancellationToken);
        return GetResult(response);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteAsync(int id, CancellationToken cancellationToken)
    {
        var response = await countryService.DeleteAsync(id, cancellationToken);
        return GetResult(response);
    }
}