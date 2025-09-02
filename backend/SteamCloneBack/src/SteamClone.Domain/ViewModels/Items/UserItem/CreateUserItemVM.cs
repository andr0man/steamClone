namespace SteamClone.Domain.ViewModels.Items.UserItem;

public class CreateUserItemVM
{
    public string UserId { get; set; } = null!;
    public string ItemId { get; set; } = null!;
    public bool IsTradable { get; set; }
}