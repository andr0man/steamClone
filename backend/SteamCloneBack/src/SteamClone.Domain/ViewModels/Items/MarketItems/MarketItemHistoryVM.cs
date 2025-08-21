using SteamClone.Domain.ViewModels.Items.UserItem;

namespace SteamClone.Domain.ViewModels.Items.MarketItems;

public class MarketItemHistoryVM
{
    public string Id { get; set; } = null!;
    public string UserItemId { get; set; } = null!;
    public UserItemVM UserItem { get; set; } = null!;
    public decimal Price { get; set; }
    public string SellerId { get; set; } = null!;
    public string BuyerId { get; set; } = null!;
    public DateTime Date { get; set; }
}