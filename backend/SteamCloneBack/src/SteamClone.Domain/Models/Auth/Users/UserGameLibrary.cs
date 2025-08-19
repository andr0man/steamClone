using SteamClone.Domain.Models.Games;

namespace SteamClone.Domain.Models.Auth.Users;

public class UserGameLibrary
{
    public string UserId { get; set; } = null!;
    public string GameId { get; set; } = null!;
    public Game Game { get; set; } = null!;
    public DateTime DateAdded { get; set; }
    public bool IsFavorite { get; set; }
}