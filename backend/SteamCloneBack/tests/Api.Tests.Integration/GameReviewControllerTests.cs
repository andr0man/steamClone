using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using SteamClone.DAL.Extensions;
using SteamClone.Domain.Models.Auth;
using SteamClone.Domain.Models.Auth.Users;
using SteamClone.Domain.Models.Countries;
using SteamClone.Domain.Models.DevelopersAndPublishers;
using SteamClone.Domain.Models.Games;
using SteamClone.Domain.ViewModels.Games.Reviews;
using Tests.Common;
using Tests.Data;

namespace Api.Tests.Integration;

public class GameReviewControllerTests : BaseIntegrationTest, IAsyncLifetime
{
    private readonly Country _country = CountryData.MainCountry;
    private readonly User _user;
    private readonly DeveloperAndPublisher _developerAndPublisher;
    private readonly Game _game;
    private readonly Review _review;

    public GameReviewControllerTests(IntegrationTestWebFactory factory) : base(factory)
    {
        _user = UserData.UserForAuth(UserId.ToString(), _country.Id);
        _developerAndPublisher = DeveloperAndPublisherData.MainDeveloperAndPublisher(_country.Id, _user.Id);
        _game = GameData.MainGame(_developerAndPublisher.Id, _user.Id);
        _review = GameReviewData.MainReview(_game.Id, _user.Id);
    }

    [Fact]
    public async Task ShouldCreateReview()
    {
        // Arrange
        var request = new CreateReviewVM
        {
            Text = "Main Review Text",
            GameId = _game.Id,
            IsPositive = true
        };

        // Act
        var response = await Client.PostAsJsonAsync("game-review", request);

        // Assert
        response.IsSuccessStatusCode.Should().BeTrue();

        var reviewFromResponse = await JsonHelper.GetPayloadAsync<Review>(response);
        var reviewId = reviewFromResponse.Id;

        var reviewFromDb = await Context.Reviews.FirstOrDefaultAsync(x => x.Id == reviewId);

        reviewFromDb.Should().NotBeNull();
        reviewFromDb.Id.Should().Be(reviewId);
        reviewFromDb.Text.Should().Be(request.Text);
        reviewFromDb.GameId.Should().Be(request.GameId);
        reviewFromDb.IsPositive.Should().Be(request.IsPositive);
    }

    [Fact]
    public async Task ShouldUpdateReview()
    {
        // Arrange
        var request = new UpdateReviewVM
        {
            Text = "Updated Review Text"
        };

        // Act
        var response = await Client.PutAsJsonAsync($"game-review/{_review.Id}", request);

        // Assert
        response.IsSuccessStatusCode.Should().BeTrue();

        var reviewFromResponse = await JsonHelper.GetPayloadAsync<Review>(response);
        var reviewId = reviewFromResponse.Id;

        var reviewFromDb = await Context.Reviews.AsNoTracking().FirstOrDefaultAsync(x => x.Id == reviewId);

        reviewFromDb.Should().NotBeNull();
        reviewFromDb.Id.Should().Be(reviewId);
        reviewFromDb.Text.Should().Be(request.Text);
    }

    [Fact]
    public async Task ShouldDeleteReview()
    {
        // Act
        var response = await Client.DeleteAsync($"game-review/{_review.Id}");
        
        // Assert
        response.IsSuccessStatusCode.Should().BeTrue();
        
        var reviewFromDb = await Context.Reviews.FirstOrDefaultAsync(x => x.Id == _review.Id);
        
        reviewFromDb.Should().BeNull();
    }
    
    [Fact]
    public async Task ShouldGetReview()
    {
        // Act
        var response = await Client.GetAsync($"game-review/{_review.Id}");
        
        // Assert
        response.IsSuccessStatusCode.Should().BeTrue();
        
        var reviewFromResponse = await JsonHelper.GetPayloadAsync<Review>(response);
        
        reviewFromResponse.Should().NotBeNull();
    }

    public async Task InitializeAsync()
    {
        await Context.AddAsync(_country);
        await Context.Users.AddAsync(_user);
        await Context.AddAuditableAsync(_developerAndPublisher);
        await Context.AddAuditableAsync(_game);
        await Context.AddAuditableAsync(_review);
        await Context.SaveChangesAsync();
    }

    public async Task DisposeAsync()
    {
        Context.ChangeTracker.Clear();
        Context.Reviews.RemoveRange(Context.Reviews);
        Context.Games.RemoveRange(Context.Games);
        Context.DevelopersAndPublishers.RemoveRange(Context.DevelopersAndPublishers);
        Context.Users.RemoveRange(Context.Users);
        Context.Countries.RemoveRange(Context.Countries);
        await Context.SaveChangesAsync();
    }
}