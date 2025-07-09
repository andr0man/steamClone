using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using SteamClone.DAL;
using SteamClone.DAL.Extensions;
using SteamClone.Domain.Models.Auth;
using SteamClone.Domain.Models.DevelopersAndPublishers;
using SteamClone.Domain.ViewModels.DevelopersAndPublishers;
using Tests.Common;
using Tests.Data;

namespace Api.Tests.Integration;

public class DeveloperAndPublisherControllerTests(IntegrationTestWebFactory factory, bool useJwtToken = true)
    : BaseIntegrationTest(factory, useJwtToken), IAsyncLifetime
{
    private readonly DeveloperAndPublisher _developerAndPublisher = DeveloperAndPublisherData.MainDeveloperAndPublisher;

    [Fact]
    public async Task ShouldCreateDeveloper()
    {
        // Arrange
        var developerAndPublisherName = "TestDeveloper";
        var developerAndPublisherDescription = "TestDeveloperAndPublisherDescription";
        var foundedDate = DateTime.UtcNow;
        var countryId = 1;
        var website = "https://test.com";
        var request = new CreateDeveloperAndPublisherVM
        {
            Name = developerAndPublisherName, Description = developerAndPublisherDescription, FoundedDate = foundedDate,
            CountryId = countryId,
            Website = website
        };

        // Act
        var response = await Client.PostAsJsonAsync("DeveloperAndPublisher", request);

        // Assert
        response.IsSuccessStatusCode.Should().BeTrue();

        var developerAndPublisherFromResponse = await JsonHelper.GetPayloadAsync<DeveloperAndPublisher>(response);
        var developerAndPublisherId = developerAndPublisherFromResponse.Id;

        var developerAndPublisherFromDb =
            await Context.DevelopersAndPublishers.FirstOrDefaultAsync(x => x.Id == developerAndPublisherId);

        developerAndPublisherFromDb.Should().NotBeNull();
        developerAndPublisherFromDb.Name.Should().Be(developerAndPublisherName);
        developerAndPublisherFromDb.Description.Should().Be(developerAndPublisherDescription);
        developerAndPublisherFromDb.FoundedDate.Should().Be(foundedDate);
        developerAndPublisherFromDb.CountryId.Should().Be(countryId);
        developerAndPublisherFromDb.Website.Should().Be(website);
    }

    [Fact]
    public async Task ShouldUpdateDeveloper()
    {
        // Arrange
        var developerAndPublisherName = "TestDeveloper";
        var developerAndPublisherDescription = "TestDeveloperAndPublisherDescription";
        var foundedDate = DateTime.UtcNow;
        var countryId = 1;
        var website = "https://test.com";
        var request = new UpdateDeveloperAndPublisherVM
        {
            Name = developerAndPublisherName, Description = developerAndPublisherDescription, FoundedDate = foundedDate,
            CountryId = countryId,
            Website = website
        };

        // Act
        var response = await Client.PutAsJsonAsync($"DeveloperAndPublisher/{_developerAndPublisher.Id}", request);

        // Assert
        response.IsSuccessStatusCode.Should().BeTrue();

        var developerAndPublisherFromResponse = await JsonHelper.GetPayloadAsync<DeveloperAndPublisher>(response);
        var developerAndPublisherId = developerAndPublisherFromResponse.Id;

        var developerAndPublisherFromDb =
            await Context.DevelopersAndPublishers.FirstOrDefaultAsync(x => x.Id == developerAndPublisherId);

        developerAndPublisherFromDb.Should().NotBeNull();
        developerAndPublisherFromDb.Name.Should().Be(developerAndPublisherName);
        developerAndPublisherFromDb.Description.Should().Be(developerAndPublisherDescription);
        developerAndPublisherFromDb.FoundedDate.Should().Be(foundedDate);
        developerAndPublisherFromDb.CountryId.Should().Be(countryId);
        developerAndPublisherFromDb.Website.Should().Be(website);
    }

    [Fact]
    public async Task ShouldDeleteDeveloper()
    {
        // Act
        var response = await Client.DeleteAsync($"DeveloperAndPublisher/{_developerAndPublisher.Id}");

        // Assert
        response.IsSuccessStatusCode.Should().BeTrue();

        var developerAndPublisherFromDb =
            await Context.DevelopersAndPublishers.FirstOrDefaultAsync(x => x.Id == _developerAndPublisher.Id);

        developerAndPublisherFromDb.Should().BeNull();
    }

    [Fact]
    public async Task ShouldNotUpdateBecauseNotFound()
    {
        // Arrange
        var request = new UpdateDeveloperAndPublisherVM
            { Name = "TestDeveloper", Description = "TestDeveloperAndPublisherDescription" };

        // Act
        var response = await Client.PutAsJsonAsync($"DeveloperAndPublisher/{int.MaxValue}", request);

        // Assert
        response.IsSuccessStatusCode.Should().BeFalse();
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task ShouldNotDeleteBecauseNotFound()
    {
        // Act
        var response = await Client.DeleteAsync($"DeveloperAndPublisher/{int.MaxValue}");

        // Assert
        response.IsSuccessStatusCode.Should().BeFalse();
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task ShouldGetAllDevelopersAndPublishers()
    {
        // Act
        var response = await Client.GetAsync("DeveloperAndPublisher");

        // Assert
        response.IsSuccessStatusCode.Should().BeTrue();

        var developersAndPublishers = await JsonHelper.GetPayloadAsync<List<DeveloperAndPublisher>>(response);

        developersAndPublishers.Should().NotBeEmpty();
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

        _developerAndPublisher.CreatedBy = UserId.ToString();
        await Context.AddAuditableAsync(_developerAndPublisher);
        await SaveChangesAsync();
    }

    public async Task DisposeAsync()
    {
        Context.DevelopersAndPublishers.RemoveRange(Context.DevelopersAndPublishers);
        Context.Users.RemoveRange(Context.Users);
        await SaveChangesAsync();
    }
}