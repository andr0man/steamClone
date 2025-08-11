using SteamClone.Domain.Common.Abstractions;

namespace SteamClone.Domain.Models.Auth.Users;

public class Balance : Entity<string>
{
    public decimal Amount { get; set; }
    public string UserId { get; set; } = null!;
}