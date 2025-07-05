using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;
using SteamClone.API;
using SteamClone.DAL.Data;
using Testcontainers.PostgreSql;

namespace Tests.Common;

public class IntegrationTestWebFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private readonly PostgreSqlContainer _dbContainer = new PostgreSqlBuilder()
        .WithImage("postgres:latest")
        .WithDatabase("db-for-test")
        .WithUsername("postgres")
        .WithPassword("postgres")
        .Build();

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
        });
    }

    private void RegisterDatabase(IServiceCollection services)
    {
        services.RemoveServiceByType(typeof(DbContextOptions<AppDbContext>));

        var dataSourceBuilder = new NpgsqlDataSourceBuilder(_dbContainer.GetConnectionString());
        dataSourceBuilder.EnableDynamicJson();
        var dataSource = dataSourceBuilder.Build();

        services.AddDbContext<AppDbContext>(
            options => options
                .UseNpgsql(
                    dataSource,
                    b => b.MigrationsAssembly(typeof(AppDbContext).Assembly.FullName))
                .UseSnakeCaseNamingConvention()
                .ConfigureWarnings(w => w.Ignore(CoreEventId.ManyServiceProvidersCreatedWarning)));
    }

    public Task InitializeAsync()
    {
        return _dbContainer.StartAsync();
    }

    public new Task DisposeAsync()
    {
        return _dbContainer.DisposeAsync().AsTask();
    }
}

public static class TestFactoryExtensions
{
    public static void RemoveServiceByType(this IServiceCollection services, Type serviceType)
    {
        var descriptor = services.SingleOrDefault(s => s.ServiceType == serviceType);
        if (descriptor is not null)
        {
            services.Remove(descriptor);
        }
    }
}