using SteamClone.Domain.Models.Common.Abstractions;

namespace SteamClone.Domain.Models.Games;

public class Genre : AuditableEntity<int>
{
    public required string Name { get; set; }
    public string? Description { get; set; }
}