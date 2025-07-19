using AutoMapper;
using SteamClone.DAL;
using SteamClone.DAL.Repositories.GameRepository;
using SteamClone.DAL.Repositories.ReviewRepository;
using SteamClone.DAL.Repositories.UserRepository;
using SteamClone.Domain.Common.Interfaces;
using SteamClone.Domain.Models.Games;
using SteamClone.Domain.ViewModels.Games.Reviews;

namespace SteamClone.BLL.Services.ReviewService;

public class ReviewService(
    IReviewRepository reviewRepository,
    IMapper mapper,
    IGameRepository gameRepository,
    IUserRepository userRepository,
    IUserProvider userProvider) : IReviewService
{
    public async Task<ServiceResponse> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var reviews = await reviewRepository.GetAllAsync(cancellationToken);

        return ServiceResponse.OkResponse("Reviews retrieved successfully", mapper.Map<List<ReviewVM>>(reviews));
    }

    public async Task<ServiceResponse> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        var review = await reviewRepository.GetByIdAsync(id, cancellationToken);

        if (review == null)
        {
            return ServiceResponse.NotFoundResponse("Review not found");
        }

        return ServiceResponse.OkResponse("Review retrieved successfully", mapper.Map<ReviewVM>(review));
    }

    public async Task<ServiceResponse> CreateAsync(CreateReviewVM model, CancellationToken cancellationToken = default)
    {
        var review = mapper.Map<Review>(model);

        review.Id = Guid.NewGuid().ToString();
        
        if (await gameRepository.GetByIdAsync(model.GameId, cancellationToken) == null)
        {
            return ServiceResponse.NotFoundResponse("Game not found");
        }

        try
        {
            var createdReview = await reviewRepository.CreateAsync(review, cancellationToken);
            
            await gameRepository.CalculateRatingAsync(createdReview!.GameId, cancellationToken);

            return ServiceResponse.OkResponse("Review created successfully", mapper.Map<ReviewVM>(createdReview));
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<ServiceResponse> UpdateAsync(string id, UpdateReviewVM model,
        CancellationToken cancellationToken = default)
    {
        var existingReview = await reviewRepository.GetByIdAsync(id, cancellationToken);

        if (existingReview == null)
        {
            return ServiceResponse.NotFoundResponse("Review not found");
        }
        
        var user = await userRepository.GetByIdAsync(await userProvider.GetUserId(), cancellationToken);

        if (user!.Id != existingReview.CreatedBy && user.RoleId != Settings.AdminRole)
        {
            return ServiceResponse.ForbiddenResponse("You don't have permission to update this review");
        }

        var updatedReview = mapper.Map(model, existingReview);

        try
        {
            var result = await reviewRepository.UpdateAsync(updatedReview, cancellationToken);
            
            await gameRepository.CalculateRatingAsync(result!.GameId, cancellationToken);

            return ServiceResponse.OkResponse("Review updated successfully", mapper.Map<ReviewVM>(result));
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<ServiceResponse> DeleteAsync(string id, CancellationToken cancellationToken = default)
    {
        try
        {
            var review = await reviewRepository.GetByIdAsync(id, cancellationToken);

            if (review == null)
            {
                return ServiceResponse.NotFoundResponse("Review not found");
            }
            
            var user = await userRepository.GetByIdAsync(await userProvider.GetUserId(), cancellationToken);
            
            if (user!.Id != review.CreatedBy && user.RoleId != Settings.AdminRole)
            {
                return ServiceResponse.ForbiddenResponse("You don't have permission to delete this review");
            }

            await reviewRepository.DeleteAsync(id, cancellationToken);
            
            await gameRepository.CalculateRatingAsync(review.GameId, cancellationToken);
            
            return ServiceResponse.OkResponse("Review deleted successfully");
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<ServiceResponse> GetByFilterAsync(FilterReviewVM filter, CancellationToken token = default)
    {
        var reviews = await reviewRepository.GetAllAsync(token);

        if (filter.GameId != null)
        {
            if (await gameRepository.GetByIdAsync(filter.GameId, token) == null)
            {
                return ServiceResponse.NotFoundResponse("Game not found");
            }
            
            reviews = reviews.Where(x => x.GameId == filter.GameId).ToList();
        }

        if (filter.FindByUser == true)
        {
            var userId = await userProvider.GetUserId();
            reviews = reviews.Where(x => x.CreatedBy == userId).ToList();
        }

        if (filter.IsPositive != null)
        {
            reviews = reviews.Where(x => x.IsPositive == filter.IsPositive).ToList();
        }

        return ServiceResponse.OkResponse("Reviews retrieved successfully", mapper.Map<List<ReviewVM>>(reviews));
    }
}