using SteamClone.Domain.ViewModels.Items.UserItem;

namespace SteamClone.Domain.ViewModels.Items.MarketItems;

public class MarketItemVM
{
    public string Id { get; set; } = null!;
    public string UserItemId { get; set; } = null!;
    public UserItemVM UserItem { get; set; } = null!;
    public decimal Price { get; set; }
    public bool IsSold { get; set; }
}