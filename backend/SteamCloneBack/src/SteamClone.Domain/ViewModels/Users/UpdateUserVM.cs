namespace SteamClone.Domain.ViewModels.Users;

public class UpdateUserVM
{
    public required string Id { get; set; }
    public string? Nickname { get; set; }
    public string? Email { get; set; }
    public int? CountryId { get; set; }
    public string? Bio {  get; set; }
}