using SteamClone.Domain.Common.Abstractions;

namespace SteamClone.Domain.Models.Items;

public class MarketItem : AuditableEntity<string>
{
    public string UserItemId { get; set; } = null!;
    public UserItem? UserItem { get; set; }
    public decimal Price { get; set; }
    public bool IsSold { get; set; } = false;
}