using AutoMapper;
using SteamClone.Domain.Models.Items;
using SteamClone.Domain.ViewModels.Items.UserItem;

namespace SteamClone.BLL.MappingProfiles;

public class UserItemMapperProfile : Profile
{
    public UserItemMapperProfile()
    {
        CreateMap<UserItem, UserItemVM>().ReverseMap();
        CreateMap<UserItem, CreateUserItemVM>().ReverseMap();
    }
}