using SteamClone.Domain.Models.Common.Abstractions;

namespace SteamClone.Domain.Models.Games;

public class Game : AuditableEntity<string>
{
    public required string Name { get; set; }
    public required string Description { get; set; }
    public List<Genre> Genres { get; set; } = new();
    public decimal Price { get; set; }
    public DateTime ReleaseDate { get; set; }
    public string Publisher { get; set; }
    public string Developer { get; set; }
    public double Rating { get; set; }
    public int NumberOfReviews { get; set; }
    public string CoverImageUrl { get; set; }
    public List<string> ScreenshotUrls { get; set; } = new();
    public List<string> SystemRequirements { get; set; } = new();
    public bool IsMultiplayer { get; set; }
    public bool IsEarlyAccess { get; set; }
}