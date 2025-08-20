using SteamClone.Domain.ViewModels.Games;

namespace SteamClone.Domain.ViewModels;

public class UserGameLibraryVM
{
    public string UserId { get; set; } = null!;
    public string GameId { get; set; } = null!;
    public GameVM Game { get; set; } = null!;
    public DateTime DateAdded { get; set; }
    public bool IsFavorite { get; set; }
}