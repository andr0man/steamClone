using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using SteamClone.DAL.Extensions;
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
    private readonly User _userForAssociate;

    public DeveloperAndPublisherControllerTests(IntegrationTestWebFactory factory) : base(factory)
    {
        _user = UserData.UserForAuth(UserId.ToString(), _country.Id);
        _developerAndPublisher = DeveloperAndPublisherData.MainDeveloperAndPublisher(_country.Id, _user.Id);
        _userForAssociate = UserData.UserForAssociate (Guid.NewGuid().ToString(), _country.Id);
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

    // Controller tests for associate/remove/get-by-associated-user endpoints
    [Fact]
    public async Task ShouldAssociateUser_WhenUserAlreadyAssociated()
    {
        // Act: associate existing associated user (should succeed with current setup)
        var url =
            $"DeveloperAndPublisher/associate-user?developerAndPublisherId={_developerAndPublisher.Id}&userId={_userForAssociate.Id}";
        using var request = new HttpRequestMessage(new HttpMethod("PATCH"), url);
        var response = await Client.SendAsync(request);

        // Assert
        response.IsSuccessStatusCode.Should().BeTrue();
    }

    [Fact]
    public async Task ShouldRemoveAssociatedUser_WhenUserIsAssociated()
    {
        // Arrange: ensure the developer has the user associated (already true from fixture)
        // Act: remove associated user
        var url =
            $"DeveloperAndPublisher/remove-associated-user?developerAndPublisherId={_developerAndPublisher.Id}&userId={_user.Id}";
        using var request = new HttpRequestMessage(new HttpMethod("PATCH"), url);
        var response = await Client.SendAsync(request);

        // Assert
        response.IsSuccessStatusCode.Should().BeTrue();

        // Verify in DB that the user is no longer associated
        var developerFromDb = await Context.DevelopersAndPublishers
            .Include(d => d.AssociatedUsers)
            .FirstOrDefaultAsync(d => d.Id == _developerAndPublisher.Id);
        developerFromDb.Should().NotBeNull();
        developerFromDb.AssociatedUsers.Should().NotContain(u => u.Id == _user.Id);
    }

    public async Task InitializeAsync()
    {
        await Context.AddAsync(_country);
        await Context.Users.AddAsync(_user);
        await Context.Users.AddAsync(_userForAssociate);
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