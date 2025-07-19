using AutoMapper;
using SteamClone.Domain.Models.Games;
using SteamClone.Domain.ViewModels.Games;
using SteamClone.Domain.ViewModels.Games.Localizations;
using SteamClone.Domain.ViewModels.Games.SystemReq;

namespace SteamClone.BLL.MappingProfiles;

public class GameMapperProfile : Profile
{
    public GameMapperProfile()
    {
        CreateMap<Game, CreateGameVM>().ReverseMap();
        CreateMap<Game, UpdateGameVM>().ReverseMap();
        CreateMap<Game, GameVM>().ReverseMap();

        CreateMap<SystemRequirements, SystemRequirementsVM>()
            .ReverseMap();
        CreateMap<SystemRequirements, UpdateSystemReqVM>()
            .ReverseMap();
        CreateMap<SystemRequirements, CreateUpdateSystemReqVm>()
            .ReverseMap();
        
        CreateMap<Localization, LocalizationVM>()
            .ReverseMap();
        CreateMap<CreateLocalizationVM, Localization>()
            .ReverseMap();
        CreateMap<UpdateLocalizationVM, Localization>()
            .ReverseMap();
    }
}