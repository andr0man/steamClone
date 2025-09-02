namespace SteamClone.Domain.ViewModels.Items;

public class ItemVM
{
    public string Id { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public string GameId { get; set; } = null!;
}