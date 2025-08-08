namespace SteamClone.Domain.ViewModels.Items;

public class CreateItemVM
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string GameId { get; set; } = null!;
}