namespace SteamClone.Domain.ViewModels.Games.SystemReq;

public class CreateUpdateSystemReqVm : UpdateSystemReqVM
{
    public required string GameId { get; set; }
}