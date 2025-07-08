using AutoMapper;
using SteamClone.Domain.Models.Auth;
using SteamClone.Domain.Models.Countries;
using SteamClone.Domain.ViewModels.Countries;

namespace SteamClone.BLL.MappingProfiles;

public class CountryMapperProfile : Profile
{
    public CountryMapperProfile()
    {
        CreateMap<Country, CreateUpdateCountryVM>()
            .ReverseMap();
    }
}