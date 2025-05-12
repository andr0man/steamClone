using Microsoft.EntityFrameworkCore;
using SteamClone.DAL.Data;

namespace DataAccessLayer;

public class ApplicationDbContextInitializer(AppDbContext context)
{
    public async Task InitializeAsync()
    {
        await context.Database.MigrateAsync();
    }
}