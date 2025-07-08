using AutoMapper;
using SteamClone.Domain.Models.Developers;
using SteamClone.Domain.ViewModels.Developers;

namespace SteamClone.BLL.MappingProfiles;

public class DeveloperMapperProfile : Profile
{
    public DeveloperMapperProfile()
    {
        CreateMap<Developer, DeveloperVM>().ReverseMap();
        CreateMap<CreateDeveloperVM, Developer>().ReverseMap();
        CreateMap<UpdateDeveloperVM, Developer>().ReverseMap();
    }
}