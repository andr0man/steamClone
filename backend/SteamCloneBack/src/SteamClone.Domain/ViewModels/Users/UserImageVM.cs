using Microsoft.AspNetCore.Http;

namespace SteamClone.Domain.ViewModels.Users;

public class UserImageVM
{
    public string UserId { get; set; }
    public IFormFile Image { get; set; }
}