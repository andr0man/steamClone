namespace SteamClone.Domain.ViewModels.Games.Reviews;

public class FilterReviewVM
{
    public string? GameId { get; set; }
    public bool? FindByUser { get; set; }
    public bool? IsPositive { get; set; }
}