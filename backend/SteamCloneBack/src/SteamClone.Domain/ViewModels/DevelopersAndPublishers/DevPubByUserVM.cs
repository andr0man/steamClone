namespace SteamClone.Domain.ViewModels.DevelopersAndPublishers;

public class DevPubByUserVM : CreateDeveloperAndPublisherVM
{
    public string Id { get; set; } = null!;
    public bool? IsApproved { get; set; }
}