using System.Text.Json;
using Microsoft.AspNetCore.Http;

namespace SteamClone.BLL.Middlewares;

public static class HttpResponseExtensions
{
    public static async Task WriteJsonResponseAsync(this HttpResponse response, int statusCode, object responseModel)
    {
        response.StatusCode = statusCode;
        response.ContentType = "application/json";
        await response.WriteAsync(JsonSerializer.Serialize(responseModel));
    }
}