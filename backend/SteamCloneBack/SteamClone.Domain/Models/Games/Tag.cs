using SteamClone.Domain.Models.Common.Abstractions;

namespace SteamClone.Domain.Models.Games;

public class Tag : AuditableEntity<string>
{
    public required string Name { get; set; }
    public string? Description { get; set; }
}