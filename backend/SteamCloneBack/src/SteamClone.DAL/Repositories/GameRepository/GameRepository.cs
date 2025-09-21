using Microsoft.EntityFrameworkCore;
using SteamClone.DAL.Data;
using SteamClone.DAL.Repositories.Common;
using SteamClone.Domain.Common.Interfaces;
using SteamClone.Domain.Models.Games;

namespace SteamClone.DAL.Repositories.GameRepository;

public class GameRepository(AppDbContext appDbContext, IUserProvider userProvider)
    : Repository<Game, string>(appDbContext, userProvider), IGameRepository
{
    private readonly AppDbContext _appDbContext = appDbContext;

    public override async Task<IEnumerable<Game>> GetAllAsync(CancellationToken token) =>
        await GetAllAsync(token,
            x => x.Genres,
            x => x.AssociatedUsers);

    public override async Task<Game?> GetByIdAsync(string id, CancellationToken token, bool asNoTracking = false)
    {
        return await GetByIdAsync(id, token, asNoTracking,
            x => x.Genres,
            x => x.SystemRequirements,
            x => x.Localizations,
            x => x.AssociatedUsers,
            x => x.Developer!,
            x => x.Publisher!);
    }

    public async Task CalculateRatingAsync(string id, CancellationToken token)
    {
        var game = await _appDbContext.Games.Include(g => g.Reviews).FirstOrDefaultAsync(g => g.Id == id, token);

        var reviews = await _appDbContext.Reviews.Where(r => r.GameId == id).ToListAsync(token);

        var complete = reviews.Count(x => x.IsPositive);

        game!.PercentageOfPositiveReviews = (int)Math.Round(100 * ((double)complete / reviews.Count));

        await _appDbContext.SaveChangesAsync(token);
    }
}