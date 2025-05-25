using System.Reflection;
using Microsoft.EntityFrameworkCore;
using SteamClone.DAL.Data.Initializer;
using SteamClone.DAL.Models;

namespace SteamClone.DAL.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options)
    : DbContext(options)
{
    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        base.OnModelCreating(builder);
        DataSeed.Seed(builder);
    }
}