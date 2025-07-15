using SteamClone.Domain.Common.Abstractions;
using SteamClone.Domain.Models.DevelopersAndPublishers;

namespace SteamClone.Domain.Models.Games;

public class Game : AuditableEntity<string>
{
    public required string Name { get; set; }
    public required string Description { get; set; }
    public List<Genre> Genres { get; set; } = new();
    public decimal Price { get; set; }
    public DateTime ReleaseDate { get; set; }
    public string DeveloperId { get; set; } = null!;
    public virtual DeveloperAndPublisher? Developer { get; set; }
    public string? PublisherId { get; set; } = null!;
    public virtual DeveloperAndPublisher? Publisher { get; set; }
    
    public int? PercentageOfPositiveReviews { get; set; }
    public string? CoverImageUrl { get; set; }
    public List<string> ScreenshotUrls { get; set; } = new();
    public List<SystemRequirements> SystemRequirements { get; set; } = new();
    public List<Review> Reviews { get; set; } = new();
}