using AutoMapper;
using SteamClone.DAL.Repositories.FriendshipRepository;
using SteamClone.Domain.Models.Auth.Users;
using SteamClone.Domain.ViewModels.Users;

namespace SteamClone.BLL.Services.FriendshipService
{
    public class FriendshipService(IFriendshipRepository friendshipRepository, IMapper mapper) : IFriendshipService
    {
        public async Task<ServiceResponse> SendRequestAsync(string senderId, string receiverId, CancellationToken token)
        {
            var existing = await friendshipRepository.GetFriendshipAsync(senderId, receiverId, token);
            if (existing != null)
                return ServiceResponse.BadRequestResponse("Friend request already exists");

            var request = new Friendship
            {
                Id = Guid.NewGuid().ToString(),
                SenderId = senderId,
                ReceiverId = receiverId,
                Status = FriendshipStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            await friendshipRepository.CreateAsync(request, token);
            return ServiceResponse.OkResponse("Friend request sent", mapper.Map<FriendshipVM>(request));
        }

        public async Task<ServiceResponse> AcceptRequestAsync(string requestId, CancellationToken token)
        {
            var request = await friendshipRepository.GetByIdAsync(requestId, token);
            if (request == null) return ServiceResponse.NotFoundResponse("Request not found");

            request.Status = FriendshipStatus.Accepted;
            await friendshipRepository.UpdateAsync(request, token);

            return ServiceResponse.OkResponse("Friend request accepted", mapper.Map<FriendshipVM>(request));
        }

        public async Task<ServiceResponse> RejectRequestAsync(string requestId, CancellationToken token)
        {
            var request = await friendshipRepository.GetByIdAsync(requestId, token);
            if (request == null) return ServiceResponse.NotFoundResponse("Request not found");

            request.Status = FriendshipStatus.Declined;
            await friendshipRepository.UpdateAsync(request, token);

            return ServiceResponse.OkResponse("Friend request rejected", mapper.Map<FriendshipVM>(request));
        }

        public async Task<ServiceResponse> GetFriendsAsync(string userId, CancellationToken token)
        {
            var friends = await friendshipRepository.GetFriendsAsync(userId, token);
            return ServiceResponse.OkResponse("Friends list", friends.Select(f => mapper.Map<FriendshipVM>(f)).ToList());
        }

        public async Task<ServiceResponse> GetFriendCountAsync(string userId, CancellationToken token)
        {
            var count = await friendshipRepository.GetFriendCountAsync(userId, token);
            return ServiceResponse.OkResponse("Friends count", count);
        }
        public async Task<ServiceResponse> GetSentRequestsAsync(string userId, CancellationToken token)
        {
            var requests = await friendshipRepository
                .GetSentRequestsAsync(userId, token);

            var result = requests.Select(r => mapper.Map<FriendshipVM>(r)).ToList();
            return ServiceResponse.OkResponse("Sent requests", result);
        }

        public async Task<ServiceResponse> GetReceivedRequestsAsync(string userId, CancellationToken token)
        {
            var requests = await friendshipRepository
                .GetReceivedRequestsAsync(userId, token);

            var result = requests.Select(r => mapper.Map<FriendshipVM>(r)).ToList();
            return ServiceResponse.OkResponse("Received requests", result);
        }
    }
}
