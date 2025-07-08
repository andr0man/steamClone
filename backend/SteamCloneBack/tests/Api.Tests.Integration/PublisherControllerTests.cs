using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using SteamClone.DAL;
using SteamClone.DAL.Extensions;
using SteamClone.Domain.Models.Auth;
using SteamClone.Domain.Models.Publishers;
using SteamClone.Domain.ViewModels.Publishers;
using Tests.Common;
using Tests.Data;

namespace Api.Tests.Integration;

public class PublisherControllerTests(IntegrationTestWebFactory factory, bool useJwtToken = true)
    : BaseIntegrationTest(factory, useJwtToken), IAsyncLifetime
{
    private readonly Publisher _publisher = PublisherData.MainPublisher;

    [Fact]
    public async Task ShouldCreatePublisher()
    {
        // Arrange
        var publisherName = "TestPublisher";
        var publisherDescription = "TestPublisherDescription";
        var foundedDate = DateTime.UtcNow;
        var countryId = 1;
        var website = "https://test.com";
        var request = new CreatePublisherVM
        {
            Name = publisherName, Description = publisherDescription, FoundedDate = foundedDate, CountryId = countryId,
            Website = website
        };

        // Act
        var response = await Client.PostAsJsonAsync("Publisher", request);

        // Assert
        response.IsSuccessStatusCode.Should().BeTrue();

        var publisherFromResponse = await JsonHelper.GetPayloadAsync<Publisher>(response);
        var publisherId = publisherFromResponse.Id;

        var publisherFromDb = await Context.Publishers.FirstOrDefaultAsync(x => x.Id == publisherId);

        publisherFromDb.Should().NotBeNull();
        publisherFromDb.Name.Should().Be(publisherName);
        publisherFromDb.Description.Should().Be(publisherDescription);
        publisherFromDb.FoundedDate.Should().Be(foundedDate);
        publisherFromDb.CountryId.Should().Be(countryId);
        publisherFromDb.Website.Should().Be(website);
    }

    [Fact]
    public async Task ShouldUpdatePublisher()
    {
        // Arrange
        var publisherName = "TestPublisher";
        var publisherDescription = "TestPublisherDescription";
        var foundedDate = DateTime.UtcNow;
        var countryId = 1;
        var website = "https://test.com";
        var request = new UpdatePublisherVM
        {
            Name = publisherName, Description = publisherDescription, FoundedDate = foundedDate, CountryId = countryId,
            Website = website
        };

        // Act
        var response = await Client.PutAsJsonAsync($"Publisher/{_publisher.Id}", request);

        // Assert
        response.IsSuccessStatusCode.Should().BeTrue();

        var publisherFromResponse = await JsonHelper.GetPayloadAsync<Publisher>(response);
        var publisherId = publisherFromResponse.Id;

        var publisherFromDb = await Context.Publishers.FirstOrDefaultAsync(x => x.Id == publisherId);

        publisherFromDb.Should().NotBeNull();
        publisherFromDb.Name.Should().Be(publisherName);
        publisherFromDb.Description.Should().Be(publisherDescription);
        publisherFromDb.FoundedDate.Should().Be(foundedDate);
        publisherFromDb.CountryId.Should().Be(countryId);
        publisherFromDb.Website.Should().Be(website);
    }

    [Fact]
    public async Task ShouldDeletePublisher()
    {
        // Act
        var response = await Client.DeleteAsync($"Publisher/{_publisher.Id}");

        // Assert
        response.IsSuccessStatusCode.Should().BeTrue();

        var publisherFromDb = await Context.Publishers.FirstOrDefaultAsync(x => x.Id == _publisher.Id);

        publisherFromDb.Should().BeNull();
    }

    [Fact]
    public async Task ShouldNotUpdateBecauseNotFound()
    {
        // Arrange
        var request = new UpdatePublisherVM { Name = "TestPublisher", Description = "TestPublisherDescription" };

        // Act
        var response = await Client.PutAsJsonAsync($"Publisher/{int.MaxValue}", request);

        // Assert
        response.IsSuccessStatusCode.Should().BeFalse();
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task ShouldNotDeleteBecauseNotFound()
    {
        // Act
        var response = await Client.DeleteAsync($"Publisher/{int.MaxValue}");

        // Assert
        response.IsSuccessStatusCode.Should().BeFalse();
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task ShouldGetAllPublishers()
    {
        // Act
        var response = await Client.GetAsync("Publisher");

        // Assert
        response.IsSuccessStatusCode.Should().BeTrue();

        var publishers = await JsonHelper.GetPayloadAsync<List<Publisher>>(response);

        publishers.Should().NotBeEmpty();
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

        _publisher.CreatedBy = UserId.ToString();
        await Context.AddAuditableAsync(_publisher);
        await SaveChangesAsync();
    }

    public async Task DisposeAsync()
    {
        Context.Publishers.RemoveRange(Context.Publishers);
        Context.Users.RemoveRange(Context.Users);
        await SaveChangesAsync();
    }
}