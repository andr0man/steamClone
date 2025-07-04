using SteamClone.DAL.Data;
using SteamClone.DAL.Repositories.Common;
using SteamClone.Domain.Common.Interfaces;
using SteamClone.Domain.Models.Games;

namespace SteamClone.DAL.Repositories.GameRepository;

public class GameRepository(AppDbContext appDbContext, IUserProvider userProvider) : Repository<Game, string>(appDbContext, userProvider), IGameRepository
{
    
}