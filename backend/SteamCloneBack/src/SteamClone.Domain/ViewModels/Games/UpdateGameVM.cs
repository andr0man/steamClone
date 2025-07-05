namespace SteamClone.Domain.ViewModels.Games;

public class UpdateGameVM
{
    public required string Name { get; set; }
    public required string Description { get; set; }
    public decimal Price { get; set; }
    public List<int> GenresIds { get; set; } = new();
}