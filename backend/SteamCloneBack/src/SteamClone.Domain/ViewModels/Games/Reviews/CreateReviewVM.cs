namespace SteamClone.Domain.ViewModels.Games.Reviews;

public class CreateReviewVM : UpdateReviewVM
{
    public bool IsPositive { get; set; }
    public string GameId { get; set; }
}