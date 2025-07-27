using AutoMapper;
using SteamClone.Domain.Models.Auth;
using SteamClone.Domain.ViewModels.Auth;
using SteamClone.Domain.ViewModels.Users;

namespace SteamClone.BLL.MappingProfiles;

public class UserMapperProfile : Profile
{
    public UserMapperProfile() 
    {
        CreateMap<User, UserVM>().ReverseMap();

        CreateMap<User, UserProfileVM>().ReverseMap();

        CreateMap<CreateUserVM, User>().ReverseMap();
            
        CreateMap<UpdateUserVM, User>().ReverseMap();
        
        CreateMap<SignUpVM, User>().ReverseMap();
        
        CreateMap<SignInVM, User>().ReverseMap();
    }
}