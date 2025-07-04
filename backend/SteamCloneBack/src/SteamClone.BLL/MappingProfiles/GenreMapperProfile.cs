using AutoMapper;
using SteamClone.Domain.Models.Games;
using SteamClone.Domain.ViewModels.Games;
using SteamClone.Domain.ViewModels.Games.Genre;

namespace SteamClone.BLL.MappingProfiles;

public class GenreMapperProfile : Profile
{
    public GenreMapperProfile()
    {
        CreateMap<Genre, CreateUpdateGenreVM>()
            .ReverseMap();
        
        CreateMap<Genre, GenreVM>()
            .ReverseMap();
    }
}