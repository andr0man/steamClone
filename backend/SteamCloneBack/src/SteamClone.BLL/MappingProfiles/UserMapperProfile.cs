using AutoMapper;
using SteamClone.DAL.Models;
using SteamClone.DAL.ViewModels;
using SteamClone.DAL.ViewModels.Auth;
using SteamClone.DAL.ViewModels.Users;

namespace SteamClone.BLL.MappingProfiles;

public class UserMapperProfile : Profile
{
    public UserMapperProfile() 
    {
        CreateMap<User, UserVM>().ReverseMap();

        CreateMap<CreateUserVM, User>().ReverseMap();
            
        CreateMap<UpdateUserVM, User>().ReverseMap();
        
        CreateMap<SignUpVM, User>().ReverseMap();
        
        CreateMap<SignInVM, User>().ReverseMap();
    }
}