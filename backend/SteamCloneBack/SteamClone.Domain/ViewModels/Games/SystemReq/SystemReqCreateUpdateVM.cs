using SteamClone.Domain.Models.Games;

namespace SteamClone.Domain.ViewModels.Games.SystemReq;

public class SystemReqCreateUpdateVM
{
    public RequirementType RequirementType { get; set; }
    public RequirementPlatform Platform { get; set; }
    public string? OS { get; set; }
    public string? Processor { get; set; }
    public string? Memory { get; set; }
    public string? Graphics { get; set; }
    public string? DirectX { get; set; }
    public string? Storage { get; set; }
    public string? Network { get; set; }
}