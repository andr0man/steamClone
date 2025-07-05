using Microsoft.EntityFrameworkCore;
using SteamClone.DAL.Data;
using SteamClone.DAL.Repositories.Common;
using SteamClone.Domain.Common.Interfaces;
using SteamClone.Domain.Models.Games;

namespace SteamClone.DAL.Repositories.GenreRepository;

public class GenreRepository(AppDbContext appDbContext, IUserProvider userProvider) : Repository<Genre, int>(appDbContext, userProvider), IGenreRepository
{
    private readonly AppDbContext _appDbContext = appDbContext;
    public async Task<bool> IsUniqueNameAsync(string name, CancellationToken token)
    {
        return await _appDbContext.Genres.FirstOrDefaultAsync(g => g.Name == name, token) == null;
    }
}