namespace SteamClone.Domain.ViewModels.Games.Genre;

public class GenreVM
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
}