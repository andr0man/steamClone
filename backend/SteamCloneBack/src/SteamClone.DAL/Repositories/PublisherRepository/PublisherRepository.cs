using SteamClone.DAL.Data;
using SteamClone.DAL.Repositories.Common;
using SteamClone.Domain.Common.Interfaces;
using SteamClone.Domain.Models.Publishers;

namespace SteamClone.DAL.Repositories.PublisherRepository;

public class PublisherRepository(AppDbContext appDbContext, IUserProvider userProvider)
    : Repository<Publisher, string>(appDbContext, userProvider), IPublisherRepository
{
}