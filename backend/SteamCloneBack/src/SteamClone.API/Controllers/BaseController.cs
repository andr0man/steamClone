using Microsoft.AspNetCore.Mvc;
using SteamClone.BLL.Services;

namespace SteamClone.API.Controllers
{
    public abstract class BaseController : ControllerBase
    {
        protected IActionResult GetResult(ServiceResponse serviceResponse)
        {
            return StatusCode((int)serviceResponse.StatusCode, serviceResponse);
        }
    }
}
