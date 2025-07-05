using Serilog;
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
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

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

app.UseAuthentication();
app.UseAuthorization();

await app.InitialiseDb();
app.MapControllers();

app.UseMiddleware<MiddlewareSecurityTokenExceptionHandling>();
app.UseMiddleware<MiddlewareExceptionHandling>();

app.Run();