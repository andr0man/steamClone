using System.Security.Claims;
using Google.Apis.Auth;
using SteamClone.Domain.Models;
using SteamClone.Domain.Models.Auth;
using SteamClone.Domain.Models.Auth.Users;
using SteamClone.Domain.ViewModels;

namespace SteamClone.BLL.Services.JwtService
{
    public interface IJwtTokenService
    {
        Task<JwtModel> GenerateTokensAsync(User user, CancellationToken token = default);
        ClaimsPrincipal GetPrincipals(string accessToken);
        Task<GoogleJsonWebSignature.Payload> VerifyGoogleToken(ExternalLoginModel model);
        string GenerateEmailConfirmationToken(User user, int minutes = 30);
    }
}
