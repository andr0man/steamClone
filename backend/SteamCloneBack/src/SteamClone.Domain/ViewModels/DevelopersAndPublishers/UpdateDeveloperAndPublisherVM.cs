namespace SteamClone.Domain.ViewModels.DevelopersAndPublishers;

public class UpdateDeveloperAndPublisherVM
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Website { get; set; }
    public DateTime? FoundedDate { get; set; }
    public int CountryId { get; set; }
}