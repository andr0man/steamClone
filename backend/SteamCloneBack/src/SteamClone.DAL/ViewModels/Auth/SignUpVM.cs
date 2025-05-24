namespace SteamClone.DAL.ViewModels.Auth;

public class SignUpVM
{
    public required string Email { get; set; }
    public required string Password { get; set; }
    public required string ConfirmPassword { get; set; }
    public required string Nickname { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
}