using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SteamClone.BLL.Services.MarketItemService;
using SteamClone.Domain.ViewModels.Items.MarketItems;

namespace SteamClone.API.Controllers;

[ApiController]
[Route("[controller]")]
[Tags("Market Item")]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class MarketItemController(IMarketItemService marketItemService) : BaseController
{
    [HttpGet]
    public async Task<IActionResult> GetAll() => GetResult(await marketItemService.GetAllAsync());
    
    [HttpGet("history")]
    public async Task<IActionResult> GetHistory() => GetResult(await marketItemService.GetHistoryAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id) => GetResult(await marketItemService.GetByIdAsync(id));

    [HttpPost("put-up-for-sale")]
    public async Task<IActionResult> PutUpForSale([FromBody] CreateMarketItemVM model) =>
        GetResult(await marketItemService.PutUpForSaleAsync(model));
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id) => GetResult(await marketItemService.DeleteAsync(id));
    
    [HttpPut("buy")]
    public async Task<IActionResult> Buy(string marketItemId) => GetResult(await marketItemService.BuyAsync(marketItemId));
}