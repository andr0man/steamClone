using SteamClone.Domain.Models.Auth.Users;

namespace SteamClone.BLL.Services.FriendshipService
{
    public interface IFriendshipService
    {
        Task<ServiceResponse> SendRequestAsync(string senderId, string receiverId, CancellationToken token);
        Task<ServiceResponse> AcceptRequestAsync(string requestId, CancellationToken token);
        Task<ServiceResponse> RejectRequestAsync(string requestId, CancellationToken token);
        Task<ServiceResponse> GetFriendsAsync(string userId, CancellationToken token);
        Task<ServiceResponse> GetFriendCountAsync(string userId, CancellationToken token);
        Task<ServiceResponse> GetSentRequestsAsync(string userId, CancellationToken token);
        Task<ServiceResponse> GetReceivedRequestsAsync(string userId, CancellationToken token);
        Task<ServiceResponse> RemoveFriendAsync(string userId, string friendId, CancellationToken token);
    }
}
