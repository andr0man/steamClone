using Microsoft.EntityFrameworkCore;
using SteamClone.DAL.Data;
using SteamClone.DAL.Repositories.Common;
using SteamClone.Domain.Common.Interfaces;
using SteamClone.Domain.Models.Games;

namespace SteamClone.DAL.Repositories.ReviewRepository;

public class ReviewRepository(AppDbContext appDbContext, IUserProvider userProvider)
    : Repository<Review, string>(appDbContext, userProvider), IReviewRepository
{
    
}