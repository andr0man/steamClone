using Microsoft.EntityFrameworkCore;
using SteamClone.DAL.Data;
using SteamClone.DAL.Repositories.Common;
using SteamClone.Domain.Models;
using SteamClone.Domain.Models.Auth;

namespace SteamClone.DAL.Repositories.CountryRepository;

public class CountryRepository(AppDbContext appDbContext)
    : RepositoryNotAuditable<Country, int>(appDbContext), ICountryRepository
{
    private readonly AppDbContext _appDbContext = appDbContext;

    public async Task<string?> CheckForUniqueness(Country model, CancellationToken token = default)
    {
        var country =
            await _appDbContext.Countries.FirstOrDefaultAsync(
                c => c.Name == model.Name || c.Alpha2Code == model.Alpha2Code || c.Alpha3Code == model.Alpha3Code, token);

        if (country != null)
        {
            if (country.Name == model.Name) return "Name";
            if (country.Alpha2Code == model.Alpha2Code) return "Alpha2Code";
            if (country.Alpha3Code == model.Alpha3Code) return "Alpha3Code";
        }

        return null;
    }
}