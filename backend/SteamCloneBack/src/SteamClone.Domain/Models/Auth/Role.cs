using SteamClone.Domain.Common.Abstractions;

namespace SteamClone.Domain.Models.Auth;

public class Role : Entity<string>
{
    public string Name { get; set; }
}