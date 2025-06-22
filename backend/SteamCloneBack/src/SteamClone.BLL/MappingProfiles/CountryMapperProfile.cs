using AutoMapper;
using SteamClone.DAL.Models;
using SteamClone.DAL.ViewModels.Countries;

namespace SteamClone.BLL.MappingProfiles;

public class CountryMapperProfile : Profile
{
    public CountryMapperProfile()
    {
        CreateMap<Country, CreateUpdateCountryVM>()
            .ReverseMap();
    }
}