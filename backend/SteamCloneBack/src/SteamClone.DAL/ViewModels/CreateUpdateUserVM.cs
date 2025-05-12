namespace SteamClone.DAL.ViewModels;

public class CreateUpdateUserVM
{
    public string? Id { get; set; }
    public required string UserName { get; set; }
    public required string Password { get; set; }
    public required string Email { get; set; }
    public bool EmailConfirmed { get; set; } = false;
    public string? PhoneNumber { get; set; }
    public bool PhoneNumberConfirmed { get; set; } = false;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public required string Role { get; set; }
}