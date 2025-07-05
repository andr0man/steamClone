using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SteamClone.API;
using SteamClone.DAL.Data;

namespace Tests.Common;

public class IntegrationTestWebFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureTestServices(services =>
        {
            RegisterDatabase(services);
        }).ConfigureAppConfiguration((_, config) =>
        {
            config
                .AddJsonFile("appsettings.Test.json")
                .AddEnvironmentVariables();
        }).UseEnvironment("Test");;
    }

    private void RegisterDatabase(IServiceCollection services)
    {
        // Видаляємо попередню реєстрацію AppDbContext, якщо вона є
        services.RemoveServiceByType(typeof(DbContextOptions<AppDbContext>));

        // Реєструємо in-memory базу даних
        services.AddDbContext<AppDbContext>(
            options => options
                .UseInMemoryDatabase("InMemoryTestDb")
                .ConfigureWarnings(w => w.Ignore(InMemoryEventId.TransactionIgnoredWarning)));
    }
}