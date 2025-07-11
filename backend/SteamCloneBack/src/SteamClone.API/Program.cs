using Serilog;
using SteamClone.API.Modules;
using SteamClone.API.Services.UserProvider;
using SteamClone.BLL;
using SteamClone.BLL.Common.Interfaces;
using SteamClone.BLL.Middlewares;
using SteamClone.DAL;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

builder.Services.AddHttpContextAccessor();

builder.Services.AddScoped<IUserProvider, UserProvider>();

builder.Services.AddDataAccess(builder);
builder.Services.AddBusinessLogic(builder);

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

await app.InitialiseDb();
app.MapControllers();

app.UseMiddleware<MiddlewareSecurityTokenExceptionHandling>();
app.UseMiddleware<MiddlewareExceptionHandling>();

app.Run();