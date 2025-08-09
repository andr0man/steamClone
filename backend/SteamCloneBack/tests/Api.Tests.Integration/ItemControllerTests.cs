using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using SteamClone.DAL.Extensions;
using SteamClone.Domain.Models.Auth;
using SteamClone.Domain.Models.Countries;
using SteamClone.Domain.Models.DevelopersAndPublishers;
using SteamClone.Domain.Models.Games;
using SteamClone.Domain.Models.Items;
using SteamClone.Domain.ViewModels.Items;
using Tests.Common;
using Tests.Data;

namespace Api.Tests.Integration;

public class ItemControllerTests : BaseIntegrationTest, IAsyncLifetime
{
    private readonly Country _country = CountryData.MainCountry;
    private readonly User _user;
    private readonly DeveloperAndPublisher _developerAndPublisher;
    private readonly Game _game;
    private readonly Item _item;
    
    public ItemControllerTests(IntegrationTestWebFactory factory, bool useJwtToken = true) : base(factory, useJwtToken)
    {
        _user = UserData.UserForAuth(UserId.ToString(), _country.Id);
        _developerAndPublisher = DeveloperAndPublisherData.MainDeveloperAndPublisher(_country.Id, _user.Id);
        _game = GameData.MainGame(_developerAndPublisher.Id, _user.Id);
        _item = ItemData.MainItem(_game.Id, _user.Id);
    }

    [Fact]
    public async Task ShouldCreateItem()
    {
        // Arrange
        var request = new CreateItemVM
        {
            Name = "TestItem",
            Description = "TestItemDescription",
            GameId = _game.Id
        };
        
        // Act
        var response = await Client.PostAsJsonAsync("Item", request);
        
        // Assert
        response.IsSuccessStatusCode.Should().BeTrue();
        
        var itemFromResponse = await JsonHelper.GetPayloadAsync<Item>(response);
        var itemId = itemFromResponse.Id;
        
        var itemFromDb = await Context.Items.FirstOrDefaultAsync(x => x.Id == itemId);
        
        itemFromDb.Should().NotBeNull();
        itemFromDb.Id.Should().Be(itemId);
        itemFromDb.Name.Should().Be(request.Name);
        itemFromDb.Description.Should().Be(request.Description);
        itemFromDb.GameId.Should().Be(request.GameId);
    }
    
    [Fact]
    public async Task ShouldGetItemById()
    {
        var response = await Client.GetAsync($"Item/{_item.Id}");

        response.IsSuccessStatusCode.Should().BeTrue();

        var itemFromResponse = await JsonHelper.GetPayloadAsync<Item>(response);

        itemFromResponse.Should().NotBeNull();
        itemFromResponse.Id.Should().Be(_item.Id);
        itemFromResponse.Name.Should().Be(_item.Name);
        itemFromResponse.Description.Should().Be(_item.Description);
        itemFromResponse.GameId.Should().Be(_item.GameId);
    }

    [Fact]
    public async Task ShouldGetAllItems()
    {
        var response = await Client.GetAsync("Item");

        response.IsSuccessStatusCode.Should().BeTrue();

        var items = await JsonHelper.GetPayloadAsync<List<Item>>(response);

        items.Should().NotBeNull();
        items.Should().Contain(x => x.Id == _item.Id);
    }

    [Fact]
    public async Task ShouldUpdateItem()
    {
        var updateRequest = new UpdateItemVM
        {
            Name = "UpdatedName",
            Description = "UpdatedDescription"
        };

        var response = await Client.PutAsJsonAsync($"Item/{_item.Id}", updateRequest);

        response.IsSuccessStatusCode.Should().BeTrue();

        var updatedItem = await JsonHelper.GetPayloadAsync<Item>(response);

        updatedItem.Should().NotBeNull();
        updatedItem.Id.Should().Be(_item.Id);
        updatedItem.Name.Should().Be(updateRequest.Name);
        updatedItem.Description.Should().Be(updateRequest.Description);

        var itemFromDb = await Context.Items.AsNoTracking().FirstOrDefaultAsync(x => x.Id == _item.Id);
        itemFromDb!.Name.Should().Be(updateRequest.Name);
        itemFromDb.Description.Should().Be(updateRequest.Description);
    }

    [Fact]
    public async Task ShouldDeleteItem()
    {
        var response = await Client.DeleteAsync($"Item/{_item.Id}");

        response.IsSuccessStatusCode.Should().BeTrue();

        var itemFromDb = await Context.Items.FirstOrDefaultAsync(x => x.Id == _item.Id);
        itemFromDb.Should().BeNull();
    }

    public async Task InitializeAsync()
    {
        await Context.AddAsync(_country);
        await Context.Users.AddAsync(_user);
        await Context.AddAuditableAsync(_developerAndPublisher);
        await Context.AddAuditableAsync(_game);
        await Context.AddAuditableAsync(_item);
        await Context.SaveChangesAsync();
    }

    public async Task DisposeAsync()
    {
        Context.ChangeTracker.Clear();
        Context.Items.RemoveRange(Context.Items);
        Context.Games.RemoveRange(Context.Games);
        Context.DevelopersAndPublishers.RemoveRange(Context.DevelopersAndPublishers);
        Context.Users.RemoveRange(Context.Users);
        Context.Countries.RemoveRange(Context.Countries);
        await Context.SaveChangesAsync();
    }
}