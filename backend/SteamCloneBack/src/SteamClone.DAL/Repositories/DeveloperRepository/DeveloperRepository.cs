using SteamClone.DAL.Data;
using SteamClone.DAL.Repositories.Common;
using SteamClone.Domain.Common.Interfaces;
using SteamClone.Domain.Models.Developers;

namespace SteamClone.DAL.Repositories.DeveloperRepository;

public class DeveloperRepository(AppDbContext appDbContext, IUserProvider userProvider)
    : Repository<Developer, string>(appDbContext, userProvider), IDeveloperRepository
{
}