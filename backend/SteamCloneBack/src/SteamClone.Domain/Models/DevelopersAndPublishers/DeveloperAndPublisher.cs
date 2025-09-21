using SteamClone.Domain.Common.Abstractions;
using SteamClone.Domain.Models.Auth.Users;
using SteamClone.Domain.Models.Countries;

namespace SteamClone.Domain.Models.DevelopersAndPublishers;

public class DeveloperAndPublisher : AuditableEntity<string>
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? LogoUrl { get; set; }
    public string? Website { get; set; }
    public DateTime? FoundedDate { get; set; }
    public int? CountryId { get; set; }
    public Country? Country { get; set; }
    public bool? IsApproved { get; set; }
    public List<User> AssociatedUsers { get; set; } = new();
}
