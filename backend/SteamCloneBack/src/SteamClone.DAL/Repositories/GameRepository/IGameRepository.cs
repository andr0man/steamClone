using SteamClone.DAL.Repositories.Common;
using SteamClone.Domain.Models.Games;

namespace SteamClone.DAL.Repositories.GameRepository;

public interface IGameRepository : IRepository<Game, string>
{
    
}