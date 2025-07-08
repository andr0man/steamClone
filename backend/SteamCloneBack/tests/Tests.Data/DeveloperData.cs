using SteamClone.Domain.Models.Developers;

namespace Tests.Data;

public class DeveloperData
{
    public static Developer MainDeveloper => new()
    {
        Id = Guid.NewGuid().ToString(),
        Name = "Test Developer",
        CountryId = 1,
        Description = "Test Developer Description",
        FoundedDate = DateTime.UtcNow
    };
}