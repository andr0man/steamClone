using Microsoft.AspNetCore.Mvc;
using SteamClone.BLL.Services;
using SteamClone.BLL.Services.AccountService;
using SteamClone.BLL.Validators;
using SteamClone.DAL.ViewModels;
using SteamClone.DAL.ViewModels.Auth;

namespace SteamClone.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AccountController(IAccountService accountService) : BaseController
    {
        [HttpPost("signin")]
        public async Task<IActionResult> SignInAsync([FromBody] SignInVM model, CancellationToken cancellationToken)
        {
            var validator = new SignInValidator();
            var validation = await validator.ValidateAsync(model, cancellationToken);

            if (!validation.IsValid)
            {
                return BadRequest(validation.Errors);
            }

            var response = await accountService.SignInAsync(model, cancellationToken);

            return GetResult(response);
        }

        [HttpPost("signup")]
        public async Task<IActionResult> SignUpAsync([FromBody] SignUpVM model, CancellationToken cancellationToken)
        {
            SignUpValidator validator = new SignUpValidator();
            var validation = await validator.ValidateAsync(model, cancellationToken);

            if (!validation.IsValid)
            {
                return BadRequest(validation.Errors);
            }

            var response = await accountService.SignUpAsync(model, cancellationToken);
            return GetResult(response);
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshTokensAsync([FromBody] JwtModel model, CancellationToken cancellationToken)
        {
            if (string.IsNullOrEmpty(model.AccessToken) ||
                string.IsNullOrEmpty(model.RefreshToken))
            {
                return GetResult(ServiceResponse.BadRequestResponse("Invalid tokens"));
            }
            
            var response = await accountService.RefreshTokensAsync(model, cancellationToken);
            return GetResult(response);
        }
    }
}