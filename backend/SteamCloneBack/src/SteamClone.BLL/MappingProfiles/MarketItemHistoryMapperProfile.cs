using AutoMapper;
using SteamClone.Domain.Models.Items;
using SteamClone.Domain.ViewModels.Items.MarketItems;

namespace SteamClone.BLL.MappingProfiles;

public class MarketItemHistoryMapperProfile : Profile
{
    public MarketItemHistoryMapperProfile()
    {
        CreateMap<MarketItemHistory, MarketItemHistoryVM>().ReverseMap();
    }
}