using SteamClone.Domain.ViewModels.Games.Genre;
using SteamClone.Domain.ViewModels.Games.SystemReq;

namespace SteamClone.Domain.ViewModels.Games;

public class GameVM
{
    public string Id { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }
    public List<GenreVM> Genres { get; set; } = new();
    public decimal Price { get; set; }
    public DateTime ReleaseDate { get; set; }
    public string? CoverImageUrl { get; set; }
    public List<string> ScreenshotUrls { get; set; } = new();
    public string DeveloperId { get; set; } = string.Empty;
    public string PublisherId { get; set; } = string.Empty;
    public List<SystemRequirementsVM> SystemRequirements { get; set; } = new();
}