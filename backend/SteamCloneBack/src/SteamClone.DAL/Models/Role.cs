using SteamClone.DAL.Models.Common.Interfaces;

namespace SteamClone.DAL.Models;

public class Role : Entity<string>
{
    public string Name { get; set; }
}