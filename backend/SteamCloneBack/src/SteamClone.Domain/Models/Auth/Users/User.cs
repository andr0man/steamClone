using SteamClone.Domain.Common.Abstractions;
using SteamClone.Domain.Models.Countries;
using SteamClone.Domain.Models.Games;

namespace SteamClone.Domain.Models.Auth.Users;

public class User : AuditableEntity<string>
{
    public required string Nickname { get; set; }
    public required string Email { get; set; }
    public required string PasswordHash { get; set; }
    public int? CountryId { get; set; }
    public Country? Country { get; set; }
    public required string RoleId { get; set; }
    public Role? Role { get; set; }
    public string? AvatarUrl { get; set; }
    public string? Bio { get; set; }
    public int Level { get; set; } = 0;
    public string? ExternalProvider { get; set; }
    public string? ExternalProviderKey { get; set; }
    public bool EmailConfirmed { get; set; }
    public Balance? Balance { get; set; }
    public List<Game> Games { get; set; } = new();
    public List<Game> AssociatedGames { get; set; } = new();
}