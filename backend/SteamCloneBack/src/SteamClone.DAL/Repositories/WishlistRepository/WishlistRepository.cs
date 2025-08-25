using Microsoft.EntityFrameworkCore;
using SteamClone.DAL.Data;
using SteamClone.Domain.Common.Interfaces;
using SteamClone.Domain.Models.Wishlists;

namespace SteamClone.DAL.Repositories.WishlistRepository;

public class WishlistRepository(AppDbContext context, IUserProvider userProvider) : IWishlistRepository
{
    public async Task<Wishlist> CreateAsync(Wishlist wishlist, CancellationToken cancellationToken)
    {
        var userId = await userProvider.GetUserId();
        var numbersOfWishlists = await context.Wishlists
            .CountAsync(w => w.UserId == userId, cancellationToken);
        wishlist.Rank = ++numbersOfWishlists;

        await context.Wishlists.AddAsync(wishlist, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
        return wishlist;
    }

    public async Task<Wishlist> DeleteAsync(Wishlist wishlist, CancellationToken cancellationToken)
    {
        context.Wishlists.Remove(wishlist);
        await context.SaveChangesAsync(cancellationToken);
        return wishlist;
    }

    public async Task MoveAsync(string userId, string gameId, bool isMoveUp = true,
        CancellationToken cancellationToken = default)
    {
        var wishlists = await context.Wishlists.ToListAsync(cancellationToken);
        
        var lastNumberOfWishlists = wishlists.Count;
        
        var wishlistItem = wishlists.FirstOrDefault(w => w.UserId == userId && w.GameId == gameId);

        if (wishlistItem == null || wishlistItem.Rank == 1 || wishlistItem.Rank == lastNumberOfWishlists)
            return; // не існує або вже на верхівці або на низу

        var currentRank = wishlistItem.Rank;
        var newRank = isMoveUp ? currentRank - 1 : currentRank + 1;

        // знаходимо гру, яка зараз на новій позиції
        var itemAbove = await context.Wishlists
            .FirstOrDefaultAsync(w => w.UserId == userId && w.Rank == newRank, cancellationToken);

        if (itemAbove != null)
        {
            itemAbove.Rank = currentRank;
        }

        wishlistItem.Rank = newRank;

        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task MoveToPositionAsync(string userId, string gameId, int position,
        CancellationToken cancellationToken)
    {
        var wishlistItem = await context.Wishlists
            .FirstOrDefaultAsync(w => w.UserId == userId && w.GameId == gameId, cancellationToken);

        if (wishlistItem == null || wishlistItem.Rank == position)
            return;

        var oldRank = wishlistItem.Rank;

        if (position < oldRank)
        {
            // зсуваємо всі ігри між newRank і oldRank-1 вниз
            var toShift = await context.Wishlists
                .Where(w => w.UserId == userId && w.Rank >= position && w.Rank < oldRank)
                .ToListAsync(cancellationToken);

            foreach (var item in toShift)
                item.Rank++;
        }
        else
        {
            // зсуваємо всі ігри між oldRank+1 і newRank вверх
            var toShift = await context.Wishlists
                .Where(w => w.UserId == userId && w.Rank <= position && w.Rank > oldRank)
                .ToListAsync(cancellationToken);

            foreach (var item in toShift)
                item.Rank--;
        }

        wishlistItem.Rank = position;

        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task<List<Wishlist>> GetAllByUserIdAsync(string userId, CancellationToken cancellationToken)
    {
        return await context.Wishlists.Include(w => w.Game)
            .Where(w => w.UserId == userId)
            .ToListAsync(cancellationToken);
    }
}