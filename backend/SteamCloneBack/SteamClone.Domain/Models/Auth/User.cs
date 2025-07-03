using SteamClone.Domain.Models.Common.Abstractions;

namespace SteamClone.Domain.Models.Auth;

public class User : AuditableEntity<string>
{
    public required string Nickname { get; set; }
    public required string Email { get; set; }
    public required string PasswordHash { get; set; }
    public required int CountryId { get; set; }
    public Country? Country { get; set; }
    public required string RoleId { get; set; }
    public Role? Role { get; set; }
    public string? ExternalProvider { get; set; }
    public string? ExternalProviderKey { get; set; }
    public bool EmailConfirmed { get; set; }
    
}