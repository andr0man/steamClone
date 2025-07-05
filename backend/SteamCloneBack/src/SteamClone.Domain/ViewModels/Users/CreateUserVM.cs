namespace SteamClone.Domain.ViewModels.Users;

public class CreateUserVM
{
    public string? Id { get; set; } = Guid.NewGuid().ToString();
    public required string Nickname { get; set; }
    public required string Email { get; set; }
    public required string Password { get; set; }
    public required string Country { get; set; }
    public required string RoleId { get; set; }
}