using AutoMapper;
using SteamClone.Domain.Models.Items;
using SteamClone.Domain.ViewModels.Items.MarketItems;

namespace SteamClone.BLL.MappingProfiles;

public class MarketItemMapperProfile : Profile
{
    public MarketItemMapperProfile()
    {
        CreateMap<MarketItem, MarketItemVM>().ReverseMap();
        CreateMap<CreateMarketItemVM, MarketItem>().ReverseMap();
    }
}