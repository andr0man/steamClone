using SteamClone.Domain.Models.Games;

namespace Tests.Data;

public class GameReviewData
{
    public static Review MainReview(string gameId, string userId) => new()
    {
        Id = Guid.NewGuid().ToString(),
        Text = "Main Review Text",
        GameId = gameId,
        CreatedBy = userId,
    };
}