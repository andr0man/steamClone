namespace SteamClone.Domain.ViewModels.Games.Reviews;

public class ReviewVM
{
    public string Id { get; set; } = null!;
    public string Text { get; set; } = null!;
    public bool IsPositive { get; set; }
    public DateTime CreatedAt { get; set; }
    public string GameId { get; set; } = null!;
}