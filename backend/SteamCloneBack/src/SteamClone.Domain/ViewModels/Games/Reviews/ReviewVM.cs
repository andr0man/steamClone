namespace SteamClone.Domain.ViewModels.Games.Reviews;

public class ReviewVM : CreateReviewVM
{
    public string Id { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
}