using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using SteamClone.DAL;
using SteamClone.DAL.Extensions;
using SteamClone.Domain.Models.Auth;
using SteamClone.Domain.Models.Countries;
using SteamClone.Domain.ViewModels.Countries;
using Tests.Common;
using Tests.Data;

namespace Api.Tests.Integration;

public class CountryControllerTests(IntegrationTestWebFactory factory)
    : BaseIntegrationTest(factory, false), IAsyncLifetime
{
    private readonly Country _country = CountryData.MainCountry;

    [Fact]
    public async Task ShouldCreateCountry()
    {
        // Arrange
        var countryName = "TestCountry";
        var countryAlpha2Code = "AA";
        var countryAlpha3Code = "AAA";
        var request = new CreateUpdateCountryVM { Name = countryName, Alpha2Code = countryAlpha2Code, Alpha3Code = countryAlpha3Code };

        // Act
        var response = await Client.PostAsJsonAsync("Country", request);

        // Assert
        response.IsSuccessStatusCode.Should().BeTrue();

        var countryFromResponse = await JsonHelper.GetPayloadAsync<Country>(response);
        var countryId = countryFromResponse.Id;

        var countryFromDb = await Context.Countries.FirstOrDefaultAsync(x => x.Id == countryId);

        countryFromDb.Should().NotBeNull();
        countryFromDb.Name.Should().Be(countryName);
        countryFromDb.Alpha2Code.Should().Be(countryAlpha2Code);
        countryFromDb.Alpha3Code.Should().Be(countryAlpha3Code);
    }
    
    [Fact]
    public async Task ShouldUpdateCountry()
    {
        // Arrange
        var countryName = "TestCountry";
        var countryAlpha2Code = "AA";
        var countryAlpha3Code = "AAA";
        var request = new CreateUpdateCountryVM { Name = countryName, Alpha2Code = countryAlpha2Code, Alpha3Code = countryAlpha3Code };

        // Act
        var response = await Client.PutAsJsonAsync($"Country/{_country.Id}", request);
        
        // Assert
        response.IsSuccessStatusCode.Should().BeTrue();
        
        var countryFromResponse = await JsonHelper.GetPayloadAsync<Country>(response);
        var countryId = countryFromResponse.Id;
        
        var countryFromDb = await Context.Countries.FirstOrDefaultAsync(x => x.Id == countryId);
        
        countryFromDb.Should().NotBeNull();
        countryFromDb.Name.Should().Be(countryName);
        countryFromDb.Alpha2Code.Should().Be(countryAlpha2Code);
        countryFromDb.Alpha3Code.Should().Be(countryAlpha3Code);
    }
    
    [Fact]
    public async Task ShouldDeleteCountry()
    {
        // Act
        var response = await Client.DeleteAsync($"Country/{_country.Id}");
        
        // Assert
        response.IsSuccessStatusCode.Should().BeTrue();
        
        var countryFromDb = await Context.Countries.FirstOrDefaultAsync(x => x.Id == _country.Id);
        
        countryFromDb.Should().BeNull();
    }

    [Fact]
    public async Task ShouldNotUpdateBecauseNotFound()
    {
        // Arrange
        var request = new CreateUpdateCountryVM { Name = "TestCountry", Alpha2Code = "AA", Alpha3Code = "AAA" };
        
        // Act
        var response = await Client.PutAsJsonAsync($"Country/{int.MaxValue}", request);
        
        // Assert
        response.IsSuccessStatusCode.Should().BeFalse();
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
    
    [Fact]
    public async Task ShouldNotDeleteBecauseNotFound()
    {
        // Act
        var response = await Client.DeleteAsync($"Country/{int.MaxValue}");
        
        // Assert
        response.IsSuccessStatusCode.Should().BeFalse();
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
    
    [Fact]
    public async Task ShouldGetAllCountries()
    {
        // Act
        var response = await Client.GetAsync("Country");
        
        // Assert
        response.IsSuccessStatusCode.Should().BeTrue();
        
        var countries = await JsonHelper.GetPayloadAsync<List<Country>>(response);
        
        countries.Should().NotBeEmpty();
    }

    public async Task InitializeAsync()
    {
        await Context.AddAsync(_country);
        await SaveChangesAsync();
    }

    public async Task DisposeAsync()
    {
        Context.Countries.RemoveRange(Context.Countries);
        Context.Users.RemoveRange(Context.Users);
        await SaveChangesAsync();
    }
}