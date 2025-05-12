using SteamClone.DAL.Models.Common.Interfaces;

namespace SteamClone.DAL.Models;

public class RefreshToken : Entity<string>
{
    public required string Id { get; set; }
    public required string Token { get; set; }
    public required string JwtId { get; set; }
    public bool IsUsed { get; set; } = false;
    public DateTime CreateDate { get; set; }
    public DateTime ExpiredDate { get; set; }
    public required string UserId { get; set; }
}