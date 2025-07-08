using SteamClone.Domain.Models.Publishers;

namespace Tests.Data;

public class PublisherData
{
    public static Publisher MainPublisher => new()
    {
        Id = Guid.NewGuid().ToString(),
        Name = "Test Publisher",
        CountryId = 1,
        Description = "Test Publisher Description",
        FoundedDate = DateTime.UtcNow
    };
}