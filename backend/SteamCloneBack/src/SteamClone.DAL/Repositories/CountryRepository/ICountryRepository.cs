using SteamClone.DAL.Models;
using SteamClone.DAL.Repositories.Common;

namespace SteamClone.DAL.Repositories.CountryRepository;

public interface ICountryRepository : IRepository<Country, int>
{
    public Task<string?> CheckForUniqueness(Country model, CancellationToken token = default);
}