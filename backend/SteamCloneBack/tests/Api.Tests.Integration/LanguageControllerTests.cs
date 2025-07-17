using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using SteamClone.Domain.Models.Languages;
using SteamClone.Domain.ViewModels.Languages;
using Tests.Common;
using Tests.Data;

namespace Api.Tests.Integration;

public class LanguageControllerTests(IntegrationTestWebFactory factory)
    : BaseIntegrationTest(factory), IAsyncLifetime
{
    private readonly Language _language = LanguageData.MainLanguage;

    [Fact]
    public async Task ShouldCreateLanguage()
    {
        // Arrange
        var languageName = "TestLanguage";
        var languageCode = "AA";
        var request = new CreateUpdateLanguageVM { Name = languageName, Code = languageCode };

        // Act
        var response = await Client.PostAsJsonAsync("Language", request);

        // Assert
        response.IsSuccessStatusCode.Should().BeTrue();

        var languageFromResponse = await JsonHelper.GetPayloadAsync<Language>(response);
        var languageId = languageFromResponse.Id;

        var languageFromDb = await Context.Languages.FirstOrDefaultAsync(x => x.Id == languageId);

        languageFromDb.Should().NotBeNull();
        languageFromDb.Name.Should().Be(languageName);
        languageFromDb.Code.Should().Be(languageCode);
    }
    
    [Fact]
    public async Task ShouldUpdateLanguage()
    {
        // Arrange
        var languageName = "TestLanguage";
        var languageCode = "AA";
        var request = new CreateUpdateLanguageVM { Name = languageName, Code = languageCode };

        // Act
        var response = await Client.PutAsJsonAsync($"Language/{_language.Id}", request);
        
        // Assert
        response.IsSuccessStatusCode.Should().BeTrue();
        
        var languageFromResponse = await JsonHelper.GetPayloadAsync<Language>(response);
        var languageId = languageFromResponse.Id;
        
        var languageFromDb = await Context.Languages.FirstOrDefaultAsync(x => x.Id == languageId);
        
        languageFromDb.Should().NotBeNull();
        languageFromDb.Name.Should().Be(languageName);
        languageFromDb.Code.Should().Be(languageCode);
    }
    
    [Fact]
    public async Task ShouldDeleteLanguage()
    {
        // Act
        var response = await Client.DeleteAsync($"Language/{_language.Id}");
        
        // Assert
        response.IsSuccessStatusCode.Should().BeTrue();
        
        var languageFromDb = await Context.Languages.FirstOrDefaultAsync(x => x.Id == _language.Id);
        
        languageFromDb.Should().BeNull();
    }

    [Fact]
    public async Task ShouldNotUpdateBecauseNotFound()
    {
        // Arrange
        var request = new CreateUpdateLanguageVM { Name = "TestLanguage", Code = "AA" };
        
        // Act
        var response = await Client.PutAsJsonAsync($"Language/{int.MaxValue}", request);
        
        // Assert
        response.IsSuccessStatusCode.Should().BeFalse();
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
    
    [Fact]
    public async Task ShouldNotDeleteBecauseNotFound()
    {
        // Act
        var response = await Client.DeleteAsync($"Language/{int.MaxValue}");
        
        // Assert
        response.IsSuccessStatusCode.Should().BeFalse();
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
    
    [Fact]
    public async Task ShouldGetAllLanguages()
    {
        // Act
        var response = await Client.GetAsync("Language");
        
        // Assert
        response.IsSuccessStatusCode.Should().BeTrue();
        
        var languages = await JsonHelper.GetPayloadAsync<List<Language>>(response);
        
        languages.Should().NotBeEmpty();
    }

    public async Task InitializeAsync()
    {
        await Context.AddAsync(_language);
        await SaveChangesAsync();
    }

    public async Task DisposeAsync()
    {
        Context.Languages.RemoveRange(Context.Languages);
        await SaveChangesAsync();
    }
}