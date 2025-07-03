using SteamClone.DAL.Repositories.Common;
using SteamClone.Domain.Models;
using SteamClone.Domain.Models.Auth;

namespace SteamClone.DAL.Repositories.CountryRepository;

public interface ICountryRepository : IRepository<Country, int>
{
    public Task<string?> CheckForUniqueness(Country model, CancellationToken token = default);
}