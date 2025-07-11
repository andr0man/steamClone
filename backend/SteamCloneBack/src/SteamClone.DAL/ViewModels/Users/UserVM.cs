namespace SteamClone.DAL.ViewModels.Users;

public class UserVM
{
    public required string Id { get; set; }
    public required string Email { get; set; }
    public required string Nickname { get; set; }
    public string? CountryName { get; set; }
    public string? RoleName { get; set; }
    public bool EmailConfirmed { get; set; }
    //public string? Image { get; set; }
}