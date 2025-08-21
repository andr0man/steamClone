using AutoMapper;
using SteamClone.DAL.Repositories.GameRepository;
using SteamClone.DAL.Repositories.UserGameLibraryRepository;
using SteamClone.Domain.Common.Interfaces;
using SteamClone.Domain.Models.UserGameLibraries;
using SteamClone.Domain.ViewModels;

namespace SteamClone.BLL.Services.UserGameLibraryService;

public class UserGameLibraryService(
    IUserGameLibraryRepository userGameLibraryRepository,
    IMapper mapper,
    IUserProvider userProvider,
    IGameRepository gameRepository) : IUserGameLibraryService
{
    public async Task<ServiceResponse> GetAllByUserAsync(CancellationToken cancellationToken = default)
    {
        var userGamesLibrary = await GetByUserIdAsync(cancellationToken);
        return ServiceResponse.OkResponse("User game libraries retrieved successfully",
            mapper.Map<List<UserGameLibraryVM>>(userGamesLibrary));
    }

    public async Task<ServiceResponse> ChangeFavoriteStatusAsync(string gameId, CancellationToken cancellationToken)
    {
        if (await gameRepository.GetByIdAsync(gameId, cancellationToken) == null)
        {
            return ServiceResponse.NotFoundResponse("Game not found");
        }
        
        var userGamesLibrary = await GetByUserIdAsync(cancellationToken);
        
        var userGameLibrary = userGamesLibrary.FirstOrDefault(x => x.GameId == gameId);
        
        if (userGameLibrary == null)
        {
            return ServiceResponse.NotFoundResponse("User don't have this game in library");
        }
        
        userGameLibrary!.IsFavorite = !userGameLibrary.IsFavorite;

        try
        {
            await userGameLibraryRepository.UpdateAsync(userGameLibrary, cancellationToken);
            return ServiceResponse.OkResponse("User game library favorite status updated successfully");
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    private async Task<List<UserGameLibrary>> GetByUserIdAsync(CancellationToken cancellationToken = default)
    {
        var userId = await userProvider.GetUserId();
        var userGamesLibrary = await userGameLibraryRepository.GetAllByUserIdAsync(userId, cancellationToken);
        
        return userGamesLibrary;
    }
}