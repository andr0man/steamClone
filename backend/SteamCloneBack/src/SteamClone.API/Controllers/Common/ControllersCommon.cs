using Microsoft.AspNetCore.Mvc;
using SteamClone.BLL.Services.Common;

namespace SteamClone.API.Controllers.Common;

public class GenericController<TKey, TCreateVM, TUpdateVM>(IServiceCRUD<TKey, TCreateVM, TUpdateVM> service)
    : BaseController
    where TCreateVM : class
    where TUpdateVM : class
{
    private readonly IServiceCRUD<TKey, TCreateVM, TUpdateVM> _service = service ?? throw new ArgumentNullException(nameof(service));

    [HttpGet]
    public async Task<IActionResult> GetAllAsync(CancellationToken cancellationToken)
    {
        var response = await _service.GetAllAsync(cancellationToken);
        return GetResult(response);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetByIdAsync(TKey id, CancellationToken cancellationToken)
    {
        var response = await _service.GetByIdAsync(id, cancellationToken);
        return GetResult(response);
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] TCreateVM model,
        CancellationToken cancellationToken)
    {
        var response = await _service.CreateAsync(model, cancellationToken);
        return GetResult(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAsync(TKey id, [FromBody] TUpdateVM model,
        CancellationToken cancellationToken)
    {
        var response = await _service.UpdateAsync(id, model, cancellationToken);
        return GetResult(response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAsync(TKey id, CancellationToken cancellationToken)
    {
        var response = await _service.DeleteAsync(id, cancellationToken);
        return GetResult(response);
    }
}