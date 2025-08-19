using System.Reflection;
using Microsoft.EntityFrameworkCore;
using SteamClone.DAL.Data.Initializer;
using SteamClone.Domain.Models.Auth;
using SteamClone.Domain.Models.Auth.Users;
using SteamClone.Domain.Models.Countries;
using SteamClone.Domain.Models.DevelopersAndPublishers;
using SteamClone.Domain.Models.Games;
using SteamClone.Domain.Models.Items;
using SteamClone.Domain.Models.Languages;

namespace SteamClone.DAL.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options)
    : DbContext(options)
{
    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<Country> Countries { get; set; }
    public DbSet<Genre> Genres { get; set; }
    public DbSet<Game> Games { get; set; }
    public DbSet<Localization> Localizations { get; set; }
    public DbSet<SystemRequirements> SystemRequirements { get; set; }
    public DbSet<DeveloperAndPublisher> DevelopersAndPublishers { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<Language> Languages { get; set; }
    public DbSet<Item> Items { get; set; }
    public DbSet<UserItem> UserItems { get; set; }
    public DbSet<MarketItem> MarketItems { get; set; }
    public DbSet<MarketItemHistory> MarketItemsHistory { get; set; }
    public DbSet<Balance> Balances { get; set; }
    public DbSet<UserGameLibrary> UserGameLibraries { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        base.OnModelCreating(builder);
        DataSeed.Seed(builder);
    }
}