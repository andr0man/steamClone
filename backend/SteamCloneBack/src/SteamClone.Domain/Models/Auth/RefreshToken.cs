using SteamClone.Domain.Common.Abstractions;

namespace SteamClone.Domain.Models.Auth;

public class RefreshToken : Entity<string>
{
    public required string Token { get; set; }
    public required string JwtId { get; set; }
    public bool IsUsed { get; set; } = false;
    public DateTime CreateDate { get; set; }
    public DateTime ExpiredDate { get; set; }
    public required string UserId { get; set; }
}