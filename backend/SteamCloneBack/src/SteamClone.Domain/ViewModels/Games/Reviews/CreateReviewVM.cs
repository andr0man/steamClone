namespace SteamClone.Domain.ViewModels.Games.Reviews;

public class CreateReviewVM
{
    public string Text { get; set; } = null!;
    public bool IsPositive { get; set; }
    public string GameId { get; set; }
}