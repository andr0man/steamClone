using SteamClone.Domain.Models.DevelopersAndPublishers;

namespace Tests.Data;

public class DeveloperAndPublisherData
{
    public static DeveloperAndPublisher MainDeveloperAndPublisher(int countryId, string userId) => new()
    {
        Id = Guid.NewGuid().ToString(),
        Name = "Main Test Developer and Publisher Name",
        CountryId = countryId,
        Description = "Main Test Developer Description",
        FoundedDate = DateTime.UtcNow,
        CreatedBy = userId
    };
}