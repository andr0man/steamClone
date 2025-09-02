using SteamClone.Domain.Common.Abstractions;

namespace SteamClone.Domain.Models.Games;

public class Review : AuditableEntity<string>
{
    public string Text { get; set; } = null!;
    public bool IsPositive { get; set; }
    public string GameId { get; set; }
}