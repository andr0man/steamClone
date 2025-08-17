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
        CreateMap<MarketItem, MarketItemHistoryVM>()
            .ForMember(dest => dest.SellerId, 
                opt => opt.MapFrom(src => src.CreatedBy))
            .ForMember(dest => dest.BuyerId, 
                opt => opt.MapFrom(src => src.ModifiedBy))
            .ForMember(dest => dest.ListedAt,
                opt => opt.MapFrom(src => src.CreatedAt))
            .ForMember(dest => dest.SoldAt,
                opt => opt.MapFrom(src => src.ModifiedAt))
            .ReverseMap();
    }
}