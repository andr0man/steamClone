using SteamClone.DAL.Data;
using SteamClone.DAL.Repositories.Common;
using SteamClone.Domain.Common.Interfaces;
using SteamClone.Domain.Models.Games;

namespace SteamClone.DAL.Repositories.LocalizationRepository;

public class LocalizationRepository(AppDbContext appDbContext, IUserProvider userProvider)
    : Repository<Localization, string>(appDbContext, userProvider), ILocalizationRepository
{
}