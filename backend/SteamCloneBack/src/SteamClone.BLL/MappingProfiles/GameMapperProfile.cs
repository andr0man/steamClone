using AutoMapper;
using SteamClone.Domain.Models.Games;
using SteamClone.Domain.ViewModels.Games;

namespace SteamClone.BLL.MappingProfiles;

public class GameMapperProfile : Profile
{
    public GameMapperProfile()
    {
        CreateMap<Game, CreateGameVM>().ReverseMap();
        CreateMap<Game, UpdateGameVM>().ReverseMap();
    }
}