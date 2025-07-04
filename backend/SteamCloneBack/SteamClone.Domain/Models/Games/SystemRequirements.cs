using SteamClone.Domain.Common.Abstractions;

namespace SteamClone.Domain.Models.Games;

public class SystemRequirements : Entity<string>
{
    public string? OS { get; set; }
    public RequirementType RequirementType { get; set; } = RequirementType.Minimum;
    public RequirementPlatform Platform { get; set; } = RequirementPlatform.Windows;
    public string? Processor { get; set; }
    public string? Memory { get; set; }
    public string? Graphics { get; set; }
    public string? DirectX { get; set; }
    public string? Storage { get; set; }
    public string? Network { get; set; }
}

public enum RequirementPlatform
{
    Windows,
    MacOS,
    Linux
}

public enum RequirementType
{
    Minimum,
    Recommended
}