using AutoMapper;
using SteamClone.DAL.Models;
using SteamClone.DAL.ViewModels;

namespace SteamClone.BLL.MappingProfiles;

public class RoleMapperProfile : Profile
{
    public RoleMapperProfile() 
    {
        CreateMap<Role, RoleVM>().ReverseMap();
    }
}