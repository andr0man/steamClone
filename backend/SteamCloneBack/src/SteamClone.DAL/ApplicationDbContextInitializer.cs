using Microsoft.EntityFrameworkCore;
using SteamClone.DAL.Data;

namespace SteamClone.DAL;

public class ApplicationDbContextInitializer(AppDbContext context)
{
    public async Task InitializeAsync()
    {
        await context.Database.MigrateAsync();
    }
}