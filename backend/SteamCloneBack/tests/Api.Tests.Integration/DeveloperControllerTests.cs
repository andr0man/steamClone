using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using SteamClone.DAL;
using SteamClone.DAL.Extensions;
using SteamClone.Domain.Models.Auth;
using SteamClone.Domain.Models.Developers;
using SteamClone.Domain.ViewModels.Developers;
using Tests.Common;
using Tests.Data;

namespace Api.Tests.Integration;

public class DeveloperControllerTests(IntegrationTestWebFactory factory, bool useJwtToken = true)
    : BaseIntegrationTest(factory, useJwtToken), IAsyncLifetime
{
    private readonly Developer _developer = DeveloperData.MainDeveloper;

    [Fact]
    public async Task ShouldCreateDeveloper()
    {
        // Arrange
        var developerName = "TestDeveloper";
        var developerDescription = "TestDeveloperDescription";
        var foundedDate = DateTime.UtcNow;
        var countryId = 1;
        var website = "https://test.com";
        var request = new CreateDeveloperVM
        {
            Name = developerName, Description = developerDescription, FoundedDate = foundedDate, CountryId = countryId,
            Website = website
        };

        // Act
        var response = await Client.PostAsJsonAsync("Developer", request);

        // Assert
        response.IsSuccessStatusCode.Should().BeTrue();

        var developerFromResponse = await JsonHelper.GetPayloadAsync<Developer>(response);
        var developerId = developerFromResponse.Id;

        var developerFromDb = await Context.Developers.FirstOrDefaultAsync(x => x.Id == developerId);

        developerFromDb.Should().NotBeNull();
        developerFromDb.Name.Should().Be(developerName);
        developerFromDb.Description.Should().Be(developerDescription);
        developerFromDb.FoundedDate.Should().Be(foundedDate);
        developerFromDb.CountryId.Should().Be(countryId);
        developerFromDb.Website.Should().Be(website);
    }

    [Fact]
    public async Task ShouldUpdateDeveloper()
    {
        // Arrange
        var developerName = "TestDeveloper";
        var developerDescription = "TestDeveloperDescription";
        var foundedDate = DateTime.UtcNow;
        var countryId = 1;
        var website = "https://test.com";
        var request = new UpdateDeveloperVM
        {
            Name = developerName, Description = developerDescription, FoundedDate = foundedDate, CountryId = countryId,
            Website = website
        };

        // Act
        var response = await Client.PutAsJsonAsync($"Developer/{_developer.Id}", request);

        // Assert
        response.IsSuccessStatusCode.Should().BeTrue();

        var developerFromResponse = await JsonHelper.GetPayloadAsync<Developer>(response);
        var developerId = developerFromResponse.Id;

        var developerFromDb = await Context.Developers.FirstOrDefaultAsync(x => x.Id == developerId);

        developerFromDb.Should().NotBeNull();
        developerFromDb.Name.Should().Be(developerName);
        developerFromDb.Description.Should().Be(developerDescription);
        developerFromDb.FoundedDate.Should().Be(foundedDate);
        developerFromDb.CountryId.Should().Be(countryId);
        developerFromDb.Website.Should().Be(website);
    }

    [Fact]
    public async Task ShouldDeleteDeveloper()
    {
        // Act
        var response = await Client.DeleteAsync($"Developer/{_developer.Id}");

        // Assert
        response.IsSuccessStatusCode.Should().BeTrue();

        var developerFromDb = await Context.Developers.FirstOrDefaultAsync(x => x.Id == _developer.Id);

        developerFromDb.Should().BeNull();
    }

    [Fact]
    public async Task ShouldNotUpdateBecauseNotFound()
    {
        // Arrange
        var request = new UpdateDeveloperVM { Name = "TestDeveloper", Description = "TestDeveloperDescription" };

        // Act
        var response = await Client.PutAsJsonAsync($"Developer/{int.MaxValue}", request);

        // Assert
        response.IsSuccessStatusCode.Should().BeFalse();
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task ShouldNotDeleteBecauseNotFound()
    {
        // Act
        var response = await Client.DeleteAsync($"Developer/{int.MaxValue}");

        // Assert
        response.IsSuccessStatusCode.Should().BeFalse();
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task ShouldGetAllDevelopers()
    {
        // Act
        var response = await Client.GetAsync("Developer");

        // Assert
        response.IsSuccessStatusCode.Should().BeTrue();

        var developers = await JsonHelper.GetPayloadAsync<List<Developer>>(response);

        developers.Should().NotBeEmpty();
    }

    public async Task InitializeAsync()
    {
        await Context.Users.AddAsync(new User
        {
            Id = UserId.ToString(),
            Email = "qwerty@gmail.com",
            PasswordHash = "fdsafdsafsad",
            RoleId = Settings.AdminRole,
            Nickname = "qwerty",
            CountryId = 1
        });

        _developer.CreatedBy = UserId.ToString();
        await Context.AddAuditableAsync(_developer);
        await SaveChangesAsync();
    }

    public async Task DisposeAsync()
    {
        Context.Developers.RemoveRange(Context.Developers);
        Context.Users.RemoveRange(Context.Users);
        await SaveChangesAsync();
    }
}