using Microsoft.AspNetCore.Mvc;
using SteamClone.BLL.Services;
using SteamClone.BLL.Services.AccountService;
using SteamClone.BLL.Validators;
using SteamClone.Domain.ViewModels;
using SteamClone.Domain.ViewModels.Auth;
using System.Net;

namespace SteamClone.API.Controllers;

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
    
    [HttpGet("emailconfirm")]
    public async Task<IActionResult> ConfirmEmailAsync([FromQuery] string t)
    {
        var response = await accountService.ConfirmEmailAsync(t);

       
        var safeMessage = WebUtility.HtmlEncode(response.Message ?? (response.Success ? "OK" : "Error"));

        var color = response.Success ? "#198754" : "#dc3545";
        var title = response.Success ? "Підтвердження email" : "Помилка підтвердження";

        var html = $@"<!doctype html>
        <html lang='uk'>
        <head>
        <meta charset='utf-8'>
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <title>{WebUtility.HtmlEncode(title)}</title>
        <style>
            body{{font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;background:#f5f7fb;color:#222;margin:0;padding:40px;}}
            .card{{max-width:720px;margin:40px auto;padding:28px;border-radius:12px;background:#fff;box-shadow:0 8px 30px rgba(16,24,40,.08);text-align:center}}
            h1{{margin:0 0 12px 0;color:{color}}}
            p{{color:#444}}
        </style>
        </head>
        <body>
        <div class='card'>
            <h1>{safeMessage}</h1>
            <p>{(response.Success ? "Дякуємо! Тепер ви можете увійти до свого акаунта." : "Токен недійсний або прострочений.")}</p>
        </div>
        </body>
        </html>";

        return new ContentResult
        {
            Content = html,
            ContentType = "text/html; charset=utf-8",
            StatusCode = response.Success ? 200 : 400
        };
    }
}