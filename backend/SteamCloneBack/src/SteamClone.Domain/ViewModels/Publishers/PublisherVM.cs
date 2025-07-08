namespace SteamClone.Domain.ViewModels.Publishers;

public class PublisherVM
{
    public string Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? LogoUrl { get; set; }
    public string? Website { get; set; }
    public DateTime? FoundedDate { get; set; }
    public int? CountryId { get; set; }
}