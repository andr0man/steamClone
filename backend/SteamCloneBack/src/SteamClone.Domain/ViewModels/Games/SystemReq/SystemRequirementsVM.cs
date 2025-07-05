using SteamClone.Domain.Models.Games;

namespace SteamClone.Domain.ViewModels.Games.SystemReq;

public class SystemRequirementsVM
{
    public string Id { get; set; }
    public string RequirementType { get; set; }
    public string Platform { get; set; }
    public string? OS { get; set; }
    public string? Processor { get; set; }
    public string? Memory { get; set; }
    public string? Graphics { get; set; }
    public string? DirectX { get; set; }
    public string? Storage { get; set; }
    public string? Network { get; set; }
}