using SteamClone.DAL.Models.Common.Abstractions;
using SteamClone.DAL.Models.Common.Interfaces;

namespace SteamClone.DAL.Models;

public class User : AuditableEntity<string>
{
    public required string Nickname { get; set; }
    public required string Email { get; set; }
    public required string PasswordHash { get; set; }
    public required string Country { get; set; }
    public required string RoleId { get; set; }
    public Role? Role { get; set; }
    public List<RefreshToken> RefreshTokens { get; set; } = new();
    public string? ExternalProvider { get; set; }
    public string? ExternalProviderKey { get; set; }
    public bool EmailConfirmed { get; set; }
    
}