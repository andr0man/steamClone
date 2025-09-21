namespace SteamClone.Domain.ViewModels.Users;

public class CreateUserVM
{
    public required string Nickname { get; set; }
    public required string Email { get; set; }
    public required string Password { get; set; }
    public required int CountryId { get; set; }
    public required string RoleId { get; set; }
}