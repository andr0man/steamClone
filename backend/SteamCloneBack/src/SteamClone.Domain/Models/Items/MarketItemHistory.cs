using SteamClone.Domain.Common.Abstractions;

namespace SteamClone.Domain.Models.Items;

public class MarketItemHistory : Entity<string>
{
    public string UserItemId { get; set; } = null!;
    public UserItem? UserItem { get; set; }
    public decimal Price { get; set; }
    public string SellerId { get; set; } = null!;
    public string BuyerId { get; set; } = null!;
    public DateTime Date { get; set; }
}
