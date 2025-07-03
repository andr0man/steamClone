namespace SteamClone.Domain.ViewModels.Games;

public class CreateUpdateGenreVM
{
    public required string Name { get; set; }
    public string? Description { get; set; }
}