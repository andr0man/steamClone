using SteamClone.Domain.Models.Games;

namespace Tests.Data;

public class GameGenreData
{
    public static Genre MainGenre => new()
    {
        Name = "Main Genre",
        Description = "Main Genre Description",
        Id = int.MaxValue
    };
}