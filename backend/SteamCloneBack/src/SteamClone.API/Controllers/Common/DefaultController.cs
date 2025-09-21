using Microsoft.AspNetCore.Mvc;

namespace SteamClone.API.Controllers.Common;

[ApiExplorerSettings(IgnoreApi = true)]
[Route("")]
[ApiController]
public class DefaultController : ControllerBase
{
    [HttpGet]
    public IActionResult Index()
    {
        return Redirect("/swagger/index.html");
    }
}