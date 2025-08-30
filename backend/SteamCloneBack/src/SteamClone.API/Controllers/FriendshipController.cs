using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SteamClone.BLL.Services.FriendshipService;
using SteamClone.Domain.Common.Interfaces;


namespace SteamClone.API.Controllers;

[Route("friends")]
[ApiController]
[Authorize]
public class FriendshipsController(IFriendshipService friendshipService, IUserProvider userProvider) : ControllerBase
{
    [HttpPost("send/{receiverId}")]
    public async Task<IActionResult> SendRequest(string receiverId, CancellationToken token)
    {
        var senderId = await userProvider.GetUserId();
        var response = await friendshipService.SendRequestAsync(senderId!, receiverId, token);
        return Ok(response);
    }

    [HttpPost("accept/{requestId}")]
    public async Task<IActionResult> Accept(string requestId, CancellationToken token)
    {
        var response = await friendshipService.AcceptRequestAsync(requestId, token);
        return Ok(response);
    }

    [HttpPost("reject/{requestId}")]
    public async Task<IActionResult> Reject(string requestId, CancellationToken token)
    {
        var response = await friendshipService.RejectRequestAsync(requestId, token);
        return Ok(response);
    }

    [HttpGet]
    public async Task<IActionResult> GetFriends(CancellationToken token)
    {
        var userId = await userProvider.GetUserId();
        var response = await friendshipService.GetFriendsAsync(userId!, token);
        return Ok(response);
    }

    [HttpGet("count")]
    public async Task<IActionResult> GetFriendCount(CancellationToken token)
    {
        var userId = await userProvider.GetUserId();
        var response = await friendshipService.GetFriendCountAsync(userId!, token);
        return Ok(response);
    }
    [HttpGet("requests/sent")]
    public async Task<IActionResult> GetSentRequests(CancellationToken token)
    {
        var userId = User.FindFirst("id")?.Value;
        if (userId == null) return Unauthorized();

        var response = await friendshipService.GetSentRequestsAsync(userId, token);
        return Ok(response);
    }

    [HttpGet("requests/received")]
    public async Task<IActionResult> GetReceivedRequests(CancellationToken token)
    {
        var userId = User.FindFirst("id")?.Value;
        if (userId == null) return Unauthorized();

        var response = await friendshipService.GetReceivedRequestsAsync(userId, token);
        return Ok(response);
    }
}