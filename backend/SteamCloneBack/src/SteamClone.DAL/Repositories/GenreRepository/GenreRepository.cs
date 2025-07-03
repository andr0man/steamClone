using SteamClone.DAL.Data;
using SteamClone.DAL.Repositories.Common;
using SteamClone.Domain.Models.Common.Interfaces;
using SteamClone.Domain.Models.Games;

namespace SteamClone.DAL.Repositories.GenreRepository;

public class GenreRepository(AppDbContext appDbContext, IUserProvider userProvider) : Repository<Genre, int>(appDbContext, userProvider), IGenreRepository
{
    private readonly AppDbContext _appDbContext = appDbContext;
}