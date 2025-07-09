using SteamClone.Domain.Models.DevelopersAndPublishers;

namespace Tests.Data;

public class DeveloperAndPublisherData
{
    public static DeveloperAndPublisher MainDeveloperAndPublisher => new()
    {
        Id = Guid.NewGuid().ToString(),
        Name = "Test Developer",
        CountryId = 1,
        Description = "Test Developer Description",
        FoundedDate = DateTime.UtcNow
    };
}