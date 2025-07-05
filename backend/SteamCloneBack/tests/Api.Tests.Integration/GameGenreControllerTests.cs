using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using SteamClone.DAL;
using SteamClone.DAL.Extensions;
using SteamClone.Domain.Models.Auth;
using SteamClone.Domain.Models.Games;
using SteamClone.Domain.ViewModels.Games.Genre;
using Tests.Common;
using Tests.Data;

namespace Api.Tests.Integration;

public class GameGenreControllerTests(IntegrationTestWebFactory factory, bool useJwtToken = true)
    : BaseIntegrationTest(factory, useJwtToken), IAsyncLifetime
{
    private readonly Genre _gameGenre = GameGenreData.MainGenre;

    [Fact]
    public async Task ShouldCreateGameGenre()
    {
        // Arrange
        var genreName = "TestGenre";
        var genreDescription = "TestGenreDescription";
        var request = new CreateUpdateGenreVM { Name = genreName, Description = genreDescription };

        // Act
        var response = await Client.PostAsJsonAsync("GameGenre", request);

        // Assert
        response.IsSuccessStatusCode.Should().BeTrue();

        var genreFromResponse = await JsonHelper.GetPayloadAsync<Genre>(response);
        var genreId = genreFromResponse.Id;

        var genreFromDb = await Context.Genres.FirstOrDefaultAsync(x => x.Id == genreId);

        genreFromDb.Should().NotBeNull();
        genreFromDb.Name.Should().Be(genreName);
        genreFromDb.Description.Should().Be(genreDescription);
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

        _gameGenre.CreatedBy = UserId.ToString();
        await Context.AddAuditableAsync(_gameGenre);
        await SaveChangesAsync();
    }

    public async Task DisposeAsync()
    {
        Context.Genres.RemoveRange(Context.Genres);
        Context.Users.RemoveRange(Context.Users);
        await SaveChangesAsync();
    }
}