using AutoMapper;
using SteamClone.Domain.Models.Languages;
using SteamClone.Domain.ViewModels.Languages;

namespace SteamClone.BLL.MappingProfiles;

public class LanguageMapperProfile : Profile
{
    public LanguageMapperProfile()
    {
        CreateMap<Language, CreateUpdateLanguageVM>()
            .ReverseMap();
        
        CreateMap<Language, LanguageVM>()
            .ReverseMap();
    }
}