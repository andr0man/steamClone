using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using SteamClone.DAL;
using SteamClone.DAL.Data;

namespace Tests.Common;

public abstract class BaseIntegrationTest : IClassFixture<IntegrationTestWebFactory>
{
    private const string JwtIssuer = "dashboard.com";
    private const string JwtAudience = "dashboard.com";
    private const string JwtSecretKey = "1fd8bcc13347efbdebb5d7660e22ffb346f8104eeb925ef0eca6b85ddbd4edbf";
    protected readonly AppDbContext Context;
    protected readonly HttpClient Client;
    protected readonly Guid UserId = Guid.NewGuid();

    protected BaseIntegrationTest(IntegrationTestWebFactory factory, bool useJwtToken = true)
    {
        var scope = factory.Services.CreateScope();
        Context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        Client = factory.WithWebHostBuilder(builder =>
            {
                builder.ConfigureTestServices(services =>
                {
                    services.AddAuthentication();
                });
            })
            .CreateClient(new WebApplicationFactoryClientOptions
            {
                AllowAutoRedirect = false,
            });

        if (useJwtToken)
            SetAuthorizationHeader();
    }

    private void SetAuthorizationHeader()
    {
        var token = GenerateJwtToken();
        Client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
    }

    protected async Task SaveChangesAsync()
    {
        await Context.SaveChangesAsync();
        Context.ChangeTracker.Clear();
    }

    protected string GenerateJwtToken()
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JwtSecretKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(ClaimTypes.Role, Settings.Roles.AdminRole),
            new("id", UserId.ToString()),
        };
        var token = new JwtSecurityToken(
            issuer: JwtIssuer,
            audience: JwtAudience,
            claims: claims,
            expires: DateTime.UtcNow.AddYears(30),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}