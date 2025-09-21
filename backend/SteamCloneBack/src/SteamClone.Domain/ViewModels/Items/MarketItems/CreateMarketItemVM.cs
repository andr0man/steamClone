namespace SteamClone.Domain.ViewModels.Items.MarketItems;

public class CreateMarketItemVM
{
    public string UserItemId { get; set; } = null!;
    public decimal Price { get; set; }
}