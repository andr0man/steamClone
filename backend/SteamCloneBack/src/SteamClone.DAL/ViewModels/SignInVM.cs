namespace SteamClone.DAL.ViewModels;

public class SignInVM
{
    public required string Email { get; set; }
    public required string Password { get; set; }
    public bool RememberMe { get; set; }
}