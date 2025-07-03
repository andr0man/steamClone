using AutoMapper;
using SteamClone.Domain.Models.Games;
using SteamClone.Domain.ViewModels.Games;

namespace SteamClone.BLL.MappingProfiles;

public class GenreMapperProfile : Profile
{
    public GenreMapperProfile()
    {
        CreateMap<Genre, CreateUpdateGenreVM>()
            .ReverseMap();
    }
}