using AutoMapper;
using SteamClone.Domain.Models;
using SteamClone.Domain.ViewModels;

namespace SteamClone.BLL.MappingProfiles;

public class RoleMapperProfile : Profile
{
    public RoleMapperProfile() 
    {
        CreateMap<Role, RoleVM>().ReverseMap();
    }
}