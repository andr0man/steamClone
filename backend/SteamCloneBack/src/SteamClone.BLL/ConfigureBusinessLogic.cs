using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using SteamClone.BLL.Services.AccountService;
using SteamClone.BLL.Services.CountryService;
using SteamClone.BLL.Services.ImageService;
using SteamClone.BLL.Services.JwtService;
using SteamClone.BLL.Services.PasswordHasher;
using SteamClone.BLL.Services.UserService;

namespace SteamClone.BLL;

public static class ConfigureBusinessLogic
{
    public static void AddBusinessLogic(this IServiceCollection services, WebApplicationBuilder builder)
    {
        services.AddServices();
    }
    
    private static void AddServices(this IServiceCollection services)
    {
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IAccountService, AccountService>();
        services.AddScoped<IPasswordHasher, PasswordHasher>();
        services.AddScoped<IImageService, ImageService>();
        services.AddScoped<IJwtTokenService, JwtTokenService>();
        services.AddScoped<ICountryService, CountryService>();
    }
}