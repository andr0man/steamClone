using SteamClone.Domain.Common.Abstractions;

namespace SteamClone.Domain.Models.Languages;

public class Language : Entity<int>
{
    public string Name { get; set; } = null!;
    public string Code { get; set; } = null!;
}