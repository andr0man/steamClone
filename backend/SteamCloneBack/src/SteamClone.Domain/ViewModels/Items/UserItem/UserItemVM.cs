namespace SteamClone.Domain.ViewModels.Items.UserItem;

public class UserItemVM
{
    public string Id { get; set; } = null!;
    public string UserId { get; set; } = null!;
    public ItemVM? Item { get; set; }
    public bool IsTradable { get; set; }
}