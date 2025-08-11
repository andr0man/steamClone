using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using SteamClone.DAL;
using SteamClone.DAL.Extensions;
using SteamClone.Domain.Models.Auth;
using SteamClone.Domain.Models.Auth.Users;
using SteamClone.Domain.Models.Countries;
using SteamClone.Domain.Models.DevelopersAndPublishers;
using SteamClone.Domain.ViewModels.DevelopersAndPublishers;
using Tests.Common;
using Tests.Data;

namespace Api.Tests.Integration;

public class DeveloperAndPublisherControllerTests
    : BaseIntegrationTest, IAsyncLifetime
{
    private readonly Country _country = CountryData.MainCountry;
    private readonly User _user;
    private readonly DeveloperAndPublisher _developerAndPublisher;

    public DeveloperAndPublisherControllerTests(IntegrationTestWebFactory factory) : base(factory)
    {
        _user = UserData.UserForAuth(UserId.ToString(), _country.Id);
        _developerAndPublisher = DeveloperAndPublisherData.MainDeveloperAndPublisher(_country.Id, _user.Id);
    }

    [Fact]
    public async Task ShouldCreateDeveloperAndPublisher()
    {
        // Arrange
        var developerAndPublisherName = "Test developer and publisher for create";
        var developerAndPublisherDescription = "Test developer and publisher description";
        var foundedDate = DateTime.UtcNow;
        var website = "https://test.com";
        
        var request = new CreateDeveloperAndPublisherVM
        {
            Name = developerAndPublisherName, Description = developerAndPublisherDescription, FoundedDate = foundedDate,
            CountryId = _country.Id,
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
        developerAndPublisherFromDb.CountryId.Should().Be(_country.Id);
        developerAndPublisherFromDb.Website.Should().Be(website);
    }

    [Fact]
    public async Task ShouldUpdateDeveloperAndPublisher()
    {
        // Arrange
        var developerAndPublisherName = "TestDeveloper";
        var developerAndPublisherDescription = "TestDeveloperAndPublisherDescription";
        var foundedDate = DateTime.UtcNow;
        var website = "https://test.com";
        
        var request = new UpdateDeveloperAndPublisherVM
        {
            Name = developerAndPublisherName, Description = developerAndPublisherDescription, FoundedDate = foundedDate,
            CountryId = _country.Id,
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
        developerAndPublisherFromDb.CountryId.Should().Be(_country.Id);
        developerAndPublisherFromDb.Website.Should().Be(website);
    }

    [Fact]
    public async Task ShouldDeleteDeveloperAndPublisher()
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

    [Fact]
    public async Task ShouldNotCreateBecauseNameExists()
    {
        // Arrange
        var developerAndPublisherName = _developerAndPublisher.Name;
        var developerAndPublisherDescription = "Test developer and publisher description";
        var foundedDate = DateTime.UtcNow;
        var website = "https://test.com";
        
        var request = new CreateDeveloperAndPublisherVM
        {
            Name = developerAndPublisherName, Description = developerAndPublisherDescription, FoundedDate = foundedDate,
            CountryId = _country.Id,
            Website = website
        };

        // Act
        var response = await Client.PostAsJsonAsync("DeveloperAndPublisher", request);

        // Assert
        response.IsSuccessStatusCode.Should().BeFalse();
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    public async Task InitializeAsync()
    {
        await Context.AddAsync(_country);
        await Context.Users.AddAsync(_user);
        await Context.AddAuditableAsync(_developerAndPublisher);
        await SaveChangesAsync();
    }

    public async Task DisposeAsync()
    {
        Context.DevelopersAndPublishers.RemoveRange(Context.DevelopersAndPublishers);
        Context.Users.RemoveRange(Context.Users);
        Context.Countries.RemoveRange(Context.Countries);
        await SaveChangesAsync();
    }
}