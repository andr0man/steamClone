namespace SteamClone.DAL.ViewModels.Users;

public class UpdateUserVM
{
    public string? Id { get; set; }
    public required string Nickname { get; set; }
    public required string Email { get; set; }
    public required string Country { get; set; }
}