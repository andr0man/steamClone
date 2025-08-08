using AutoMapper;
using SteamClone.Domain.Models.Items;
using SteamClone.Domain.ViewModels.Items;

namespace SteamClone.BLL.MappingProfiles;

public class ItemMapperProfile : Profile
{
    public ItemMapperProfile()
    {
        CreateMap<Item, ItemVM>().ReverseMap();
        CreateMap<CreateItemVM, Item>().ReverseMap();
        CreateMap<UpdateItemVM, Item>().ReverseMap();
    }
}