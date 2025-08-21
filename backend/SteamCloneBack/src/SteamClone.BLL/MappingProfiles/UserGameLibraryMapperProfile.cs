using AutoMapper;
using SteamClone.Domain.Models.Auth.Users;
using SteamClone.Domain.Models.UserGameLibraries;
using SteamClone.Domain.ViewModels;

namespace SteamClone.BLL.MappingProfiles;

public class UserGameLibraryMapperProfile : Profile
{
    public UserGameLibraryMapperProfile()
    {
        CreateMap<UserGameLibrary, UserGameLibraryVM>().ReverseMap();
    }
}