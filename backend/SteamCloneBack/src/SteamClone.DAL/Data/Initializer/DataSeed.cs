using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using SteamClone.Domain.Models.Auth;
using SteamClone.Domain.Models.Auth.Users;
using SteamClone.Domain.Models.Countries;
using SteamClone.Domain.Models.DevelopersAndPublishers;
using SteamClone.Domain.Models.Games;
using SteamClone.Domain.Models.Languages;

namespace SteamClone.DAL.Data.Initializer;

public static class DataSeed
{
    private const string CountriesJsonPath = "wwwroot/countries/countries.json";

    public static void Seed(ModelBuilder modelBuilder)
    {
        SeedRoles(modelBuilder);
        SeedCountries(modelBuilder);
        SeedLanguages(modelBuilder);
        SeedGameGenres(modelBuilder);

        // for testing
        var (adminId, userId, managerId) = SeedUsers(modelBuilder);
        var developerAndPublisherId = SeedDevelopersAndPublishers(managerId, modelBuilder);
    }

    private static string SeedDevelopersAndPublishers(string managerId, ModelBuilder modelBuilder)
    {
        var developerAndPublisher = new DeveloperAndPublisher
        {
            Id = Guid.NewGuid().ToString(),
            Name = "DeveloperAndPublisher",
            FoundedDate = DateTime.UtcNow,
            CountryId = 231,
            Description = "DeveloperAndPublisher description",
            IsApproved = true
        };
        
        modelBuilder.Entity<DeveloperAndPublisher>().HasData(developerAndPublisher);
        
        // modelBuilder.Entity<DeveloperAndPublisher>()
        //     .HasMany(x => x.AssociatedUsers)
        //     .WithMany()
        //     .UsingEntity(x => x.HasData(new
        //     {
        //         DeveloperAndPublisherId = developerAndPublisher.Id,
        //         AssociatedUsersId = managerId
        //     }));
        
        return developerAndPublisher.Id;
    }

    private static (string adminId, string userId, string managerId) SeedUsers(ModelBuilder modelBuilder)
    {
        var admin = new User
        {
            Id = Guid.NewGuid().ToString(),
            Nickname = "Admin",
            Email = "admin@mail.com",
            PasswordHash =
                "7D64D8B0B76B23625CA2804E54F2B9F9562EE3175AD21AB02ACB9AE80E80C970-C8DCFB0B66B8BA472A481750248172C3", // string123
            RoleId = Settings.AdminRole,
            EmailConfirmed = true,
            CountryId = 231
        };

        var user = new User
        {
            Id = Guid.NewGuid().ToString(),
            Nickname = "User",
            Email = "user@mail.com",
            PasswordHash =
                "7D64D8B0B76B23625CA2804E54F2B9F9562EE3175AD21AB02ACB9AE80E80C970-C8DCFB0B66B8BA472A481750248172C3", // string123
            RoleId = Settings.UserRole,
            EmailConfirmed = true,
            CountryId = 231
        };

        var manager = new User
        {
            Id = Guid.NewGuid().ToString(),
            Nickname = "Manager",
            Email = "manager@mail.com",
            PasswordHash =
                "7D64D8B0B76B23625CA2804E54F2B9F9562EE3175AD21AB02ACB9AE80E80C970-C8DCFB0B66B8BA472A481750248172C3", // string123
            RoleId = Settings.ManagerRole,
            EmailConfirmed = true,
            CountryId = 231
        };

        var userList = new List<User>
        {
            admin,
            user,
            manager
        };

        modelBuilder.Entity<User>().HasData(userList);
        
        modelBuilder.Entity<Balance>().HasData(new List<Balance>
        {
            new()
            {
                Id = Guid.NewGuid().ToString(),
                UserId = admin.Id,
                Amount = 100
            },
            new()
            {
                Id = Guid.NewGuid().ToString(),
                UserId = user.Id,
                Amount = 100
            },
            new()
            {
                Id = Guid.NewGuid().ToString(),
                UserId = manager.Id,
                Amount = 100
            }
        });
        
        return (admin.Id, user.Id, manager.Id);
    }

    private static void SeedGameGenres(ModelBuilder modelBuilder)
    {
        List<Genre> genres =
        [
            new() { Id = 1, Name = "Action" },
            new() { Id = 2, Name = "Adventure" },
            new() { Id = 3, Name = "RPG" },
            new() { Id = 4, Name = "Strategy" },
            new() { Id = 5, Name = "Simulation" },
            new() { Id = 6, Name = "Sports" },
            new() { Id = 7, Name = "Racing" }
        ];

        modelBuilder.Entity<Genre>().HasData(genres);
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

    private static void SeedLanguages(ModelBuilder modelBuilder)
    {
        try
        {
            var json = File.ReadAllText("wwwroot/languages/languages.json");
            var languagesDto = JsonSerializer.Deserialize<List<LanguageDto>>(json);

            var languages = languagesDto!
                .Select((l, index) => new { Id = index + 1, Code = l.code, Name = l.name });

            modelBuilder.Entity<Language>().HasData(languages);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error seeding languages: {ex.Message}");
        }
    }


    private static void SeedCountries(ModelBuilder modelBuilder)
    {
        try
        {
            var json = File.ReadAllText(CountriesJsonPath);
            var countryDtos = JsonSerializer.Deserialize<List<CountryDto>>(json);

            if (countryDtos == null || !countryDtos.Any())
            {
                Console.WriteLine("Warning: No countries found in the JSON file or the file is empty.");
                return;
            }

            var countries = countryDtos
                .Where(c => !string.IsNullOrWhiteSpace(c.alpha2) && !string.IsNullOrWhiteSpace(c.name) &&
                            !string.IsNullOrWhiteSpace(c.alpha3))
                .Select((c, index) => new Country
                {
                    Id = index + 1,
                    Name = c.name.Trim(),
                    Alpha2Code = c.alpha2.Trim().ToUpper(),
                    Alpha3Code = c.alpha3.Trim().ToUpper()
                })
                .ToList();

            modelBuilder.Entity<Country>().HasData(countries);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error seeding countries: {ex.Message}");
        }
    }

    private class CountryDto
    {
        public string name { get; set; } = string.Empty;
        public string alpha2 { get; set; } = string.Empty;
        public string alpha3 { get; set; } = string.Empty;
        public string unicode { get; set; } = string.Empty;
        public string emoji { get; set; } = string.Empty;
        public string dialCode { get; set; } = string.Empty;
        public string region { get; set; } = string.Empty;
        public string capital { get; set; } = string.Empty;
    }

    private class LanguageDto
    {
        public string name { get; set; } = string.Empty;
        public string code { get; set; } = string.Empty;
    }
}