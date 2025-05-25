using Microsoft.AspNetCore.Http;
using System.Text.Json;
using SteamClone.BLL.Services;

namespace SteamClone.BLL.Middlewares
{
    public class MiddlewareExceptionHandling(RequestDelegate next)
    {
        public async Task Invoke(HttpContext context)
        {
            try
            {
                await next(context);
            }
            catch (Exception ex)
            {
                await context.Response.WriteJsonResponseAsync(StatusCodes.Status500InternalServerError,
                    ServiceResponse.InternalServerErrorResponse(ex.Message));
            }
        }
    }
}
