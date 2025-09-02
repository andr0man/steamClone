using SteamClone.DAL.Repositories.Common;
using SteamClone.Domain.Models.Games;

namespace SteamClone.DAL.Repositories.GenreRepository;

public interface IGenreRepository : IRepository<Genre, int>
{
    Task<bool> IsUniqueNameAsync(string name, CancellationToken token);
}