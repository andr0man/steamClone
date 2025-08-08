using SteamClone.Domain.Common.Abstractions;

namespace SteamClone.Domain.Models.Items;

public class UserItem : Entity<string>
{
    public string UserId { get; set; } = null!;
    public Item? Item { get; set; }
    public string ItemId { get; set; } = null!;
    public bool IsTradable { get; set; }
}