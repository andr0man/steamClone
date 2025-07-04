namespace SteamClone.Domain.ViewModels.Games.Genre;

public class CreateUpdateGenreVM
{
    public required string Name { get; set; }
    public string? Description { get; set; }
}