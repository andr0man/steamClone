using SteamClone.Domain.Common.Abstractions;

namespace SteamClone.Domain.Models.Items;

public class Item : AuditableEntity<string>
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public string GameId { get; set; } = null!;
}