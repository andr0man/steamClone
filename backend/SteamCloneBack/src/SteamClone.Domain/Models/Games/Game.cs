using SteamClone.Domain.Common.Abstractions;
using SteamClone.Domain.Models.Developers;
using SteamClone.Domain.Models.Publishers;

namespace SteamClone.Domain.Models.Games;

public class Game : AuditableEntity<string>
{
    public required string Name { get; set; }
    public required string Description { get; set; }
    public List<Genre> Genres { get; set; } = new();
    public decimal Price { get; set; }
    public DateTime ReleaseDate { get; set; }
    public string? DeveloperId { get; set; }
    public virtual Developer? Developer { get; set; }
    
    public string? PublisherId { get; set; }
    public virtual Publisher? Publisher { get; set; }
    
    // public double? Rating { get; set; }
    // public int NumberOfReviews { get; set; }
    public string? CoverImageUrl { get; set; }
    public List<string> ScreenshotUrls { get; set; } = new();
    public List<SystemRequirements> SystemRequirements { get; set; } = new();
}