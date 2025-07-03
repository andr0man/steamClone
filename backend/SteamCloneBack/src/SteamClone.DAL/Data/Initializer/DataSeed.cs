using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using SteamClone.Domain.Models;

namespace SteamClone.DAL.Data.Initializer;

public static class DataSeed
{
    private const string CountriesJsonPath = "wwwroot/countries/countries.json";

    public static void Seed(ModelBuilder modelBuilder)
    {
        SeedRoles(modelBuilder);
        SeedCountries(modelBuilder);
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
                .Where(c => !string.IsNullOrWhiteSpace(c.alpha2) && !string.IsNullOrWhiteSpace(c.name) && !string.IsNullOrWhiteSpace(c.alpha3))
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
}