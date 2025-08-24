using SteamClone.Domain.Models.Games;

namespace Tests.Data;

public class GameData
{
    public static Game MainGame(string developerId, string userId) => new()
    {
        Id = Guid.NewGuid().ToString(),
        Name = "Main Game Name",
        Description = "Main Game Description",
        Price = 10.0m,
        ReleaseDate = DateTime.UtcNow,
        DeveloperId = developerId,
        PublisherId = developerId,
        CreatedBy = userId,
        IsApproved = true,
    };
}