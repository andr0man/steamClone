using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using SteamClone.BLL.Services.AccountService;
using SteamClone.BLL.Services.CountryService;
using SteamClone.BLL.Services.DeveloperAndPublisherService;
using SteamClone.BLL.Services.GameService;
using SteamClone.BLL.Services.GenreService;
using SteamClone.BLL.Services.ImageService;
using SteamClone.BLL.Services.JwtService;
using SteamClone.BLL.Services.LanguageService;
using SteamClone.BLL.Services.MailService;
using SteamClone.BLL.Services.PasswordHasher;
using SteamClone.BLL.Services.ReviewService;
using SteamClone.BLL.Services.UserService;

namespace SteamClone.BLL;

public static class ConfigureBusinessLogic
{
    public static void AddBusinessLogic(this IServiceCollection services, WebApplicationBuilder builder)
    {
        services.AddServices();
        
        services.AddJwtTokenAuth(builder);
        services.AddSwaggerAuth();
    }
    
    private static void AddServices(this IServiceCollection services)
    {
        services.AddScoped<IPasswordHasher, PasswordHasher>();
        services.AddScoped<IMailService, MailService>();
        services.AddScoped<IImageService, ImageService>();
        services.AddScoped<IJwtTokenService, JwtTokenService>();
        
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IAccountService, AccountService>();
        services.AddScoped<ICountryService, CountryService>();
        services.AddScoped<IGenreService, GenreService>();
        services.AddScoped<IGameService, GameService>();
        services.AddScoped<IDeveloperAndPublisherService, DeveloperAndPublisherService>();
        services.AddScoped<IReviewService, ReviewService>();
        services.AddScoped<ILanguageService, LanguageService>();
    }
    
    private static void AddJwtTokenAuth(this IServiceCollection services, WebApplicationBuilder builder)
    {
        services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                // options.TokenValidationParameters = new TokenValidationParameters
                // {
                //     RequireExpirationTime = true,
                //     ValidateLifetime = true,
                //     ClockSkew = TimeSpan.Zero,
                //     ValidateIssuer = true,
                //     ValidateAudience = true,
                //     ValidateIssuerSigningKey = true,
                //     IssuerSigningKey =
                //         new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder!.Configuration["AuthSettings:key"]!)),
                //     ValidIssuer = builder.Configuration["AuthSettings:issuer"],
                //     ValidAudience = builder.Configuration["AuthSettings:audience"]
                // };
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    RequireExpirationTime = false,
                    ValidateLifetime = false,
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey =
                        new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder!.Configuration["AuthSettings:key"]!)),
                    ValidIssuer = builder.Configuration["AuthSettings:issuer"],
                    ValidAudience = builder.Configuration["AuthSettings:audience"]
                };
            });
    }

    private static void AddSwaggerAuth(this IServiceCollection services)
    {
        services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo { Title = "softstream", Version = "v1" });

            options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Name = "Authorization",
                Type = SecuritySchemeType.Http,
                Scheme = "Bearer",
                BearerFormat = "JWT",
                In = ParameterLocation.Header,
                Description = "Введіть JWT токен"
            });

            options.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    Array.Empty<string>()
                }
            });
        });
    }
}