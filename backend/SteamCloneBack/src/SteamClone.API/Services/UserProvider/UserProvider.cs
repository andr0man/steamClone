using SteamClone.BLL.Common.Interfaces;
using SteamClone.DAL.Repositories.UserRepository;

namespace SteamClone.API.Services.UserProvider;

public class UserProvider(IHttpContextAccessor context) : IUserProvider
{
    private readonly IHttpContextAccessor _context = context ?? throw new ArgumentNullException(nameof(context));

    public string GetUserId()
    {
        var userIdStr = _context.HttpContext!.User.FindFirst("id")?.Value;
        
        if (userIdStr == null)
        {
            throw new InvalidOperationException("User ID claim not found.");
        }
        
        return userIdStr;
    }
}