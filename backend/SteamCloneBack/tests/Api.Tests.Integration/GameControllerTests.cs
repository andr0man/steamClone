using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using SteamClone.DAL;
using SteamClone.DAL.Extensions;
using SteamClone.Domain.Models.Auth;
using SteamClone.Domain.Models.Countries;
using SteamClone.Domain.Models.DevelopersAndPublishers;
using SteamClone.Domain.Models.Games;
using SteamClone.Domain.ViewModels.Games;
using Tests.Common;
using Tests.Data;

namespace Api.Tests.Integration;

public class GameControllerTests : BaseIntegrationTest, IAsyncLifetime
{
    private readonly Country _country = CountryData.MainCountry;
    private readonly DeveloperAndPublisher _developerAndPublisher;
    private readonly Game _game;

    public GameControllerTests(IntegrationTestWebFactory factory) : base(factory)
    {
        _developerAndPublisher = DeveloperAndPublisherData.MainDeveloperAndPublisher(_country.Id);
        _game = GameData.MainGame(_developerAndPublisher.Id);
    }

    [Fact]
    public async Task ShouldCreateGame()
    {
        // Arrange
        var gameName = "Test game for create";
        var gameDescription = "Test game description";
        var price = 20.0m;
        var releaseDate = DateTime.UtcNow;
        var request = new CreateGameVM
        {
            Name = gameName,
            Description = gameDescription,
            Price = price,
            ReleaseDate = releaseDate,
            DeveloperId = _developerAndPublisher.Id,
            PublisherId = _developerAndPublisher.Id,
            GenresIds = new List<int>()
        };

        // Act
        var response = await Client.PostAsJsonAsync("Game", request);

        // Assert
        response.IsSuccessStatusCode.Should().BeTrue();

        var gameFromResponse = await JsonHelper.GetPayloadAsync<Game>(response);
        var gameId = gameFromResponse.Id;

        var gameFromDb = await Context.Games.FirstOrDefaultAsync(x => x.Id == gameId);

        gameFromDb.Should().NotBeNull();
        gameFromDb.Name.Should().Be(gameName);
        gameFromDb.Description.Should().Be(gameDescription);
        gameFromDb.Price.Should().Be(price);
        gameFromDb.ReleaseDate.Should().Be(releaseDate);
        gameFromDb.DeveloperId.Should().Be(_developerAndPublisher.Id);
        gameFromDb.PublisherId.Should().Be(_developerAndPublisher.Id);
    }

    [Fact]
    public async Task ShouldUpdateGame()
    {
        // Arrange
        var gameName = "TestGame";
        var gameDescription = "TestGameDescription";
        var price = 30.0m;
        var releaseDate = DateTime.UtcNow;
        var request = new UpdateGameVM
        {
            Name = gameName,
            Description = gameDescription,
            Price = price,
            ReleaseDate = releaseDate,
            DeveloperId = _developerAndPublisher.Id,
            PublisherId = _developerAndPublisher.Id,
            GenresIds = new List<int>()
        };

        // Act
        var response = await Client.PutAsJsonAsync($"Game/{_game.Id}", request);

        // Assert
        response.IsSuccessStatusCode.Should().BeTrue();

        var gameFromResponse = await JsonHelper.GetPayloadAsync<Game>(response);
        var gameId = gameFromResponse.Id;

        Context.ChangeTracker.Clear();

        var gameFromDb = await Context.Games.FirstOrDefaultAsync(x => x.Id == gameId);

        gameFromDb.Should().NotBeNull();
        gameFromDb.Name.Should().Be(gameName);
        gameFromDb.Description.Should().Be(gameDescription);
        gameFromDb.Price.Should().Be(price);
        gameFromDb.ReleaseDate.Should().Be(releaseDate);
        gameFromDb.DeveloperId.Should().Be(_developerAndPublisher.Id);
        gameFromDb.PublisherId.Should().Be(_developerAndPublisher.Id);
    }

    [Fact]
    public async Task ShouldDeleteGame()
    {
        // Act
        var response = await Client.DeleteAsync($"Game/{_game.Id}");

        // Assert
        response.IsSuccessStatusCode.Should().BeTrue();

        var gameFromDb = await Context.Games.FirstOrDefaultAsync(x => x.Id == _game.Id);

        gameFromDb.Should().BeNull();
    }

    [Fact]
    public async Task ShouldNotUpdateBecauseNotFound()
    {
        // Arrange
        var request = new UpdateGameVM
        {
            Name = "TestGame",
            Description = "TestGameDescription",
            Price = 0,
            ReleaseDate = DateTime.UtcNow,
            DeveloperId = _developerAndPublisher.Id,
            PublisherId = _developerAndPublisher.Id,
            GenresIds = new List<int>()
        };

        // Act
        var response = await Client.PutAsJsonAsync($"Game/{Guid.NewGuid()}", request);

        // Assert
        response.IsSuccessStatusCode.Should().BeFalse();
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task ShouldNotDeleteBecauseNotFound()
    {
        // Act
        var response = await Client.DeleteAsync($"Game/{Guid.NewGuid()}");

        // Assert
        response.IsSuccessStatusCode.Should().BeFalse();
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task ShouldGetAllGames()
    {
        // Act
        var response = await Client.GetAsync("Game");

        // Assert
        response.IsSuccessStatusCode.Should().BeTrue();

        var games = await JsonHelper.GetPayloadAsync<List<Game>>(response);

        games.Should().NotBeEmpty();
    }

    public async Task InitializeAsync()
    {
        await Context.AddAsync(_country);
        await Context.Users.AddAsync(UserData.UserForAuth(UserId.ToString(), _country.Id));
        _developerAndPublisher.CountryId = _country.Id;
        _developerAndPublisher.CreatedBy = UserId.ToString();
        await Context.AddAuditableAsync(_developerAndPublisher);
        _game.CreatedBy = UserId.ToString();
        await Context.AddAuditableAsync(_game);
        await Context.SaveChangesAsync();
    }

    public async Task DisposeAsync()
    {
        Context.ChangeTracker.Clear();
        Context.Games.RemoveRange(Context.Games);
        Context.DevelopersAndPublishers.RemoveRange(Context.DevelopersAndPublishers);
        Context.Users.RemoveRange(Context.Users);
        Context.Countries.RemoveRange(Context.Countries);
        await Context.SaveChangesAsync();
    }
}