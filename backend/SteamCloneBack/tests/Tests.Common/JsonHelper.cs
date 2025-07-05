using System.Net.Http.Json;
using System.Text.Json;
using SteamClone.BLL.Services;

namespace Tests.Common;

public static class JsonHelper
{
    private static readonly JsonSerializerOptions DefaultOptions = new JsonSerializerOptions
    {
        PropertyNameCaseInsensitive = true
    };

    public static async Task<T> GetPayloadAsync<T>(HttpResponseMessage response)
    {
        var serviceResponse = await response.Content.ReadFromJsonAsync<ServiceResponse>(DefaultOptions)
                              ?? throw new InvalidOperationException("Response content is null or invalid.");

        var payloadJson = JsonSerializer.Serialize(serviceResponse.Payload, DefaultOptions);

        var payload = JsonSerializer.Deserialize<T>(payloadJson, DefaultOptions)
                      ?? throw new InvalidOperationException("Failed to deserialize payload.");

        return payload;
    }
}
