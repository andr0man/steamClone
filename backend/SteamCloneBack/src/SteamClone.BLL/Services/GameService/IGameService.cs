using SteamClone.BLL.Services.Common;
using SteamClone.Domain.ViewModels.Games;

namespace SteamClone.BLL.Services.GameService;

public interface IGameService : IServiceCRUD<string, CreateGameVM, UpdateGameVM>
{
    
}