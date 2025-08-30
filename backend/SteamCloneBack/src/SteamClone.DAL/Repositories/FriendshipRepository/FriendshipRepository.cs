using Microsoft.EntityFrameworkCore;
using SteamClone.DAL.Data;
using SteamClone.DAL.Repositories.Common;
using SteamClone.Domain.Common.Interfaces;
using SteamClone.Domain.Models.Auth.Users;


namespace SteamClone.DAL.Repositories.FriendshipRepository
{
    public class FriendshipRepository(AppDbContext context, IUserProvider userProvider)
    : Repository<Friendship, string>(context, userProvider), IFriendshipRepository
    {
        public async Task<List<Friendship>> GetFriendsAsync(string userId, CancellationToken token)
        {
            return await context.Friendships
                .Where(f => (f.SenderId == userId || f.ReceiverId == userId) && f.Status == FriendshipStatus.Accepted)
                .ToListAsync(token);
        }

        public async Task<int> GetFriendCountAsync(string userId, CancellationToken token)
        {
            return await context.Friendships
                .CountAsync(f => (f.SenderId == userId || f.ReceiverId == userId) && f.Status == FriendshipStatus.Accepted, token);
        }

        public async Task<Friendship?> GetFriendshipAsync(string senderId, string receiverId, CancellationToken token)
        {
            return await context.Friendships
                .FirstOrDefaultAsync(f =>
                    (f.SenderId == senderId && f.ReceiverId == receiverId) ||
                    (f.SenderId == receiverId && f.ReceiverId == senderId), token);
        }
        public async Task<IEnumerable<Friendship>> GetSentRequestsAsync(string userId, CancellationToken token)
        {
            return await context.Friendships
                .Where(f => f.SenderId == userId && f.Status == FriendshipStatus.Pending)
                .Include(f => f.Receiver)
                .ToListAsync(token);
        }

        public async Task<IEnumerable<Friendship>> GetReceivedRequestsAsync(string userId, CancellationToken token)
        {
            return await context.Friendships
                .Where(f => f.ReceiverId == userId && f.Status == FriendshipStatus.Pending)
                .Include(f => f.Sender)
                .ToListAsync(token);
        }
    }
}
