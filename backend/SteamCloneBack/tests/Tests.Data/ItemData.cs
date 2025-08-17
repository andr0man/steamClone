using SteamClone.Domain.Models.Items;

namespace Tests.Data;

public class ItemData
{
    public static Item MainItem(string gameId, string userId) => new()
    {
        Id = Guid.NewGuid().ToString(),
        Name = "Main Item Name",
        Description = "Main Item Description",
        GameId = gameId,
        CreatedBy = userId,
    };
}