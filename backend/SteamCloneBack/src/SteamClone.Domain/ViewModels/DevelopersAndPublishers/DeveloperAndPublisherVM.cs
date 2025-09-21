namespace SteamClone.Domain.ViewModels.DevelopersAndPublishers;

public class DeveloperAndPublisherVM : CreateDeveloperAndPublisherVM
{
    public string Id { get; set; } = null!;
    public string? CreatedBy { get; set; }
}