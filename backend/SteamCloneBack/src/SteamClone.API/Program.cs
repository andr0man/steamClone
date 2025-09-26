using System.ComponentModel;
using Microsoft.Extensions.FileProviders;
using Serilog;
using SteamClone.API.Converters;
using SteamClone.API.Modules;
using SteamClone.API.Services.UserProvider;
using SteamClone.BLL;
using SteamClone.BLL.Middlewares;
using SteamClone.DAL;
using SteamClone.Domain.Common.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddControllers();
TypeDescriptor.AddAttributes(typeof(bool?), new TypeConverterAttribute(typeof(NullableBoolTypeConverter)));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins(
                    "http://localhost:5173",
                    "http://localhost:3000",
                    "http://localhost",
                    "http://20.238.27.31",
                    "http://flux-games.pp.ua")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        });
});

builder.Services.AddHttpContextAccessor();

builder.Services.AddDataAccess(builder);
builder.Services.AddBusinessLogic(builder);

builder.Services.AddScoped<IUserProvider, UserProvider>();

builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateLogger();

builder.Host.UseSerilog();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();


if (!app.Environment.IsEnvironment("Test"))
{
    await app.InitialiseDb();
}

app.MapControllers();

app.UseMiddleware<MiddlewareSecurityTokenExceptionHandling>();
app.UseMiddleware<MiddlewareExceptionHandling>();

var imagesPath = Path.Combine(builder.Environment.ContentRootPath, Settings.ImagesPathSettings.ImagesPath);

if (!Directory.Exists(imagesPath))
{
    Directory.CreateDirectory(imagesPath);

    foreach (var file in Settings.ImagesPathSettings.ListOfDirectoriesNames)
    {
        var containersPath = Path.Combine(imagesPath, file);
        if (!Directory.Exists(containersPath))
        {
            Directory.CreateDirectory(containersPath);
        }
    }
}

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(imagesPath),
    RequestPath = $"/{Settings.ImagesPathSettings.StaticFileRequestPath}"
});

app.Run();

namespace SteamClone.API
{
    public partial class Program;
}