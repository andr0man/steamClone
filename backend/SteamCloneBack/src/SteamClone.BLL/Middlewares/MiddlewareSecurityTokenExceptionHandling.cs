using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;
using System.Text.Json;
using SteamClone.BLL.Services;

namespace SteamClone.BLL.Middlewares
{
    public class MiddlewareSecurityTokenExceptionHandling(RequestDelegate next)
    {
        public async Task Invoke(HttpContext context)
        {
            try
            {
                await next(context);
            }
            catch (SecurityTokenException ex)
            {
                await context.Response.WriteJsonResponseAsync(StatusCodes.Status426UpgradeRequired,
                    ServiceResponse.GetResponse(ex.Message, false, null, System.Net.HttpStatusCode.UpgradeRequired));
            }
        }
    }
}
