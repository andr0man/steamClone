namespace SteamClone.Domain.ViewModels.Users;

public class UserVM
{
    public required string Id { get; set; }
    public required string Email { get; set; }
    public required string UserName { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Image { get; set; }
    public required string Role { get; set; }
}