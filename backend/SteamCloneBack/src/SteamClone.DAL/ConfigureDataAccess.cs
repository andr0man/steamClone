using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;
using SteamClone.DAL.Data;
using SteamClone.DAL.Repositories.Common;
using SteamClone.DAL.Repositories.CountryRepository;
using SteamClone.DAL.Repositories.DeveloperRepository;
using SteamClone.DAL.Repositories.GameRepository;
using SteamClone.DAL.Repositories.GenreRepository;
using SteamClone.DAL.Repositories.RefreshTokenRepository;
using SteamClone.DAL.Repositories.RoleRepository;
using SteamClone.DAL.Repositories.UserRepository;

namespace SteamClone.DAL;

public static class ConfigureDataAccess
{
    public static void AddDataAccess(this IServiceCollection services, WebApplicationBuilder builder)
    {
        var dataSourceBuild = new NpgsqlDataSourceBuilder(builder.Configuration.GetConnectionString("Default"));

        dataSourceBuild.EnableDynamicJson();
        var dataSource = dataSourceBuild.Build();
        
        services.AddDbContext<AppDbContext>(
            options => options
                .UseNpgsql(
                    dataSource,
                    npgsqlDbContextOptionsBuilder => npgsqlDbContextOptionsBuilder.MigrationsAssembly(typeof(AppDbContext).Assembly.FullName))
                .UseSnakeCaseNamingConvention()
                .ConfigureWarnings(w => w.Ignore(CoreEventId.ManyServiceProvidersCreatedWarning)));

        services.AddScoped<ApplicationDbContextInitializer>();
        services.AddRepositories();
    }
    
    private static void AddRepositories(this IServiceCollection services)
    {
        services.AddScoped(typeof(IRepository<,>), typeof(Repository<,>));
        
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
        services.AddScoped<IRoleRepository, RoleRepository>();
        services.AddScoped<ICountryRepository, CountryRepository>();
        services.AddScoped<IGenreRepository, GenreRepository>();
        services.AddScoped<IGameRepository, GameRepository>();
        services.AddScoped<IDeveloperRepository, DeveloperRepository>();
    }
}