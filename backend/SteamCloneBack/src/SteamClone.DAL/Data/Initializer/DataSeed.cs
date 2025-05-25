using Microsoft.EntityFrameworkCore;
using SteamClone.DAL.Models;

namespace SteamClone.DAL.Data.Initializer;

public static class DataSeed
{
    public static void Seed(ModelBuilder modelBuilder)
    {
        SeedRoles(modelBuilder);
    }

    private static void SeedRoles(ModelBuilder modelBuilder)
    {
        var roles = new List<Role>();

        foreach (var role in Settings.ListOfRoles)
        {
            roles.Add(new Role { Name = role, Id = role });
        }

        modelBuilder.Entity<Role>().HasData(roles);
    }
}