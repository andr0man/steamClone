using SteamClone.DAL.Models.Common.Abstractions;

namespace SteamClone.DAL.Models;

public class Country : Entity<int>
{
    public string Name { get; set; }
    public string Alpha2Code { get; set; }
    public string Alpha3Code { get; set; }
}