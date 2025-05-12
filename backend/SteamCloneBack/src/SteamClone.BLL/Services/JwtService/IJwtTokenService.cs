using System.Security.Claims;
using Google.Apis.Auth;
using SteamClone.DAL.Models;
using SteamClone.DAL.ViewModels;

namespace SteamClone.BLL.Services.JwtService
{
    public interface IJwtTokenService
    {
        Task<JwtModel> GenerateTokensAsync(User user);
        ClaimsPrincipal GetPrincipals(string accessToken);
        Task<GoogleJsonWebSignature.Payload> VerifyGoogleToken(ExternalLoginModel model);
    }
}
