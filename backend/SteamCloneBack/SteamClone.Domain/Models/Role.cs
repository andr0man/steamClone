using SteamClone.Domain.Models.Common.Abstractions;

namespace SteamClone.Domain.Models;

public class Role : Entity<string>
{
    public string Name { get; set; }
}