using SteamClone.DAL.Data;
using SteamClone.DAL.Repositories.Common;
using SteamClone.Domain.Common.Interfaces;
using SteamClone.Domain.Models.Games;

namespace SteamClone.DAL.Repositories.SystemRequirementsRepo;

public class SystemRequirementsRepo(AppDbContext appDbContext, IUserProvider userProvider)
    : Repository<SystemRequirements, string>(appDbContext, userProvider), ISystemRequirementsRepo
{
}