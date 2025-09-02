using SteamClone.Domain.Models.Countries;

namespace Tests.Data;

public class CountryData
{
    public static Country MainCountry => new()
    {
        Id = 0,
        Name = "MainCountry",
        Alpha2Code = "MA",
        Alpha3Code = "MAC"
    };
}