using SteamClone.DAL.Repositories.GameRepository;
using SteamClone.DAL.Repositories.WishlistRepository;
using SteamClone.Domain.Common.Interfaces;
using SteamClone.Domain.Models.Wishlists;

namespace SteamClone.BLL.Services.WishlistService;

public class WishlistService(
    IWishlistRepository wishlistRepository,
    IUserProvider userProvider,
    IGameRepository gameRepository) : IWishlistService
{
    public async Task<ServiceResponse> GetAllByUserAsync(CancellationToken token)
    {
        var userId = await userProvider.GetUserId();
        var wishlist = await wishlistRepository.GetAllByUserIdAsync(userId, token);
        return ServiceResponse.OkResponse("Wishlist retrieved successfully", wishlist);
    }

    public async Task<ServiceResponse> AddAsync(string gameId, CancellationToken token)
    {
        var userId = await userProvider.GetUserId();

        var gameValidate = await ValidateGame(gameId, token);
        if (gameValidate != null)
        {
            return gameValidate;
        }
        
        var existingWishlistItem = await wishlistRepository.GetByUserIdAndGameIdAsync(userId, gameId, token);

        if (existingWishlistItem != null)
        {
            return ServiceResponse.NotFoundResponse("Game already in wishlist");
        }

        var wishlist = new Wishlist
        {
            GameId = gameId,
            UserId = userId
        };

        try
        {
            await wishlistRepository.CreateAsync(wishlist, token);
            return ServiceResponse.OkResponse("Game added to wishlist successfully");
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<ServiceResponse> RemoveAsync(string gameId, CancellationToken token)
    {
        var userId = await userProvider.GetUserId();

        var validateResponse = await ValidateRequirements(gameId, userId, token);
        if (validateResponse != null)
        {
            return validateResponse;
        }

        try
        {
            await wishlistRepository.DeleteAsync(new Wishlist { GameId = gameId, UserId = userId }, token);
            return ServiceResponse.OkResponse("Game removed from wishlist successfully");
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<ServiceResponse> MoveAsync(string gameId, bool isMoveUp, CancellationToken token)
    {
        var userId = await userProvider.GetUserId();

        var validateResponse = await ValidateRequirements(gameId, userId, token);
        if (validateResponse != null)
        {
            return validateResponse;
        }

        try
        {
            await wishlistRepository.MoveAsync(userId, gameId, isMoveUp, token);
            return ServiceResponse.OkResponse("Game moved successfully");
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<ServiceResponse> MoveToPositionAsync(string gameId, int position, CancellationToken token)
    {
        var userId = await userProvider.GetUserId();

        var validateResponse = await ValidateRequirements(gameId, userId, token);
        if (validateResponse != null)
        {
            return validateResponse;
        }
        
        try
        {
            await wishlistRepository.MoveToPositionAsync(userId, gameId, position, token);
            return ServiceResponse.OkResponse("Game moved successfully");
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<ServiceResponse> IsInWishlistAsync(string gameId, CancellationToken token)
    {
        var userId = await userProvider.GetUserId();
        
        var gameValidate = await ValidateGame(gameId, token);
        if (gameValidate != null)
        {
            return gameValidate;
        }
        
        var existingWishlistItem = await wishlistRepository.GetByUserIdAndGameIdAsync(userId, gameId, token);

        if (existingWishlistItem == null)
        {
            return ServiceResponse.OkResponse("Game not found in wishlist", false);
        }
        
        return ServiceResponse.OkResponse("Game found in wishlist", true);
    }

    private async Task<ServiceResponse?> ValidateRequirements(string gameId, string? userId = null,
        CancellationToken token = default,
        string messageForExistingWishlistItem = "Game not found in wishlist")
    {
        var gameValidate = await ValidateGame(gameId, token);
        if (gameValidate != null)
        {
            return gameValidate;
        }


        userId ??= await userProvider.GetUserId();

        var existingWishlistItem = await wishlistRepository.GetByUserIdAndGameIdAsync(userId, gameId, token, asNoTracking: true);

        if (existingWishlistItem == null)
        {
            return ServiceResponse.NotFoundResponse(messageForExistingWishlistItem);
        }

        return null;
    }

    private async Task<ServiceResponse?> ValidateGame(string gameId, CancellationToken token)
    {
        var game = await gameRepository.GetByIdAsync(gameId, token, asNoTracking: true);

        if (game == null)
        {
            return ServiceResponse.NotFoundResponse("Game not found");
        }

        return null;
    }
}