using Microsoft.AspNetCore.Http;
using System.Text.Json;
using SteamClone.BLL.Services;

namespace SteamClone.BLL.Middlewares
{
    public class MiddlewareExceptionHandling
    {
        private readonly RequestDelegate _next;

        public MiddlewareExceptionHandling(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                var response = ServiceResponse.InternalServerErrorResponse(ex.Message);
                context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync(JsonSerializer.Serialize(response));
            }
        }
    }
}
