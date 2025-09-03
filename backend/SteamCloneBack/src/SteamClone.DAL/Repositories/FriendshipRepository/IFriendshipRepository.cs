using SteamClone.DAL.Repositories.Common;
using SteamClone.Domain.Models.Auth.Users;

namespace SteamClone.DAL.Repositories.FriendshipRepository
{
    public interface IFriendshipRepository : IRepository<Friendship, string>
    {
        Task<List<Friendship>> GetFriendsAsync(string userId, CancellationToken token);
        Task<int> GetFriendCountAsync(string userId, CancellationToken token);
        Task<Friendship?> GetFriendshipAsync(string senderId, string receiverId, CancellationToken token);
        Task<IEnumerable<Friendship>> GetSentRequestsAsync(string userId, CancellationToken token);
        Task<IEnumerable<Friendship>> GetReceivedRequestsAsync(string userId, CancellationToken token);
    }
}
