using SteamClone.Domain.Models.Games;

namespace SteamClone.Domain.ViewModels.Games;

public class SystemRequirementsVM
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