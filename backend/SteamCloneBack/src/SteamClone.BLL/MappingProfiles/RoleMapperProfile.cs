using AutoMapper;
using SteamClone.Domain.Models.Auth;
using SteamClone.Domain.ViewModels;

namespace SteamClone.BLL.MappingProfiles;

public class RoleMapperProfile : Profile
{
    public RoleMapperProfile() 
    {
        CreateMap<Role, RoleVM>().ReverseMap();
    }
}