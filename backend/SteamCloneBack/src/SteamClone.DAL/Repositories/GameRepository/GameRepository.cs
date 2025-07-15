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
        await _appDbContext.Games
            .Include(g => g.Genres)
            .Include(g => g.SystemRequirements)
            .AsNoTracking()
            .ToListAsync(token);

    public override async Task<Game?> GetByIdAsync(string id, CancellationToken token, bool asNoTracking = false)
    {
        var query = _appDbContext.Games
            .Include(x => x.Genres)
            .Include(x => x.SystemRequirements).AsQueryable();

        if (asNoTracking)
            query = query.AsNoTracking();
        return await query.FirstOrDefaultAsync(e => e.Id!.Equals(id), token);
    }

    public async Task CalculateRatingAsync(string id, CancellationToken token)
    {
        var game = await _appDbContext.Games.Include(g => g.Reviews).FirstOrDefaultAsync(g => g.Id == id, token);

        var reviews = await _appDbContext.Reviews.Where(r => r.GameId == id).ToListAsync(token);
        
        var complete = reviews.Count(x => x.IsPositive);
        
        game!.PercentageOfPositiveReviews = (int)Math.Round((double)(100 * complete) / reviews.Count);
        
        await _appDbContext.SaveChangesAsync(token);
    }
}