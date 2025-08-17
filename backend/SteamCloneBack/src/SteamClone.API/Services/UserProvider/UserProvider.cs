using Microsoft.EntityFrameworkCore;
using SteamClone.DAL.Data;
using SteamClone.DAL.Repositories.UserRepository;
using SteamClone.Domain.Common.Interfaces;

namespace SteamClone.API.Services.UserProvider;

public class UserProvider(IHttpContextAccessor context, AppDbContext appDbContext) : IUserProvider
{
    private readonly IHttpContextAccessor _context = context ?? throw new ArgumentNullException(nameof(context));

    public async Task<string> GetUserId()
    {
        var userIdStr = _context.HttpContext!.User.FindFirst("id")?.Value;

        if (userIdStr == null)
        {
            throw new InvalidOperationException("User ID claim not found.");
        }

        if (await appDbContext.Users
                .FirstOrDefaultAsync(u => u.Id == userIdStr, CancellationToken.None) == null)
        {
            throw new InvalidOperationException("User does not exist.");
        }

        return userIdStr;
    }

    public string GetUserRole()
    {
        var userRole = _context.HttpContext!.User.Claims
            .FirstOrDefault(c => c.Type.Contains("role", StringComparison.OrdinalIgnoreCase))?.Value;
        
        if (userRole == null)
        {
            throw new InvalidOperationException("User role claim not found.");
        }
        
        return userRole;
    } 
}