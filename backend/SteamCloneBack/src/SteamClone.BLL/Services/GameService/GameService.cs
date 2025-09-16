using AutoMapper;
using Microsoft.AspNetCore.Http;
using SteamClone.BLL.Services.ImageService;
using SteamClone.DAL;
using SteamClone.DAL.Repositories.BalanceRepository;
using SteamClone.DAL.Repositories.DeveloperAndPublisherRepository;
using SteamClone.DAL.Repositories.GameRepository;
using SteamClone.DAL.Repositories.GenreRepository;
using SteamClone.DAL.Repositories.LanguageRepository;
using SteamClone.DAL.Repositories.LocalizationRepository;
using SteamClone.DAL.Repositories.SystemRequirementsRepo;
using SteamClone.DAL.Repositories.UserGameLibraryRepository;
using SteamClone.DAL.Repositories.UserRepository;
using SteamClone.DAL.Repositories.WishlistRepository;
using SteamClone.Domain.Common.Interfaces;
using SteamClone.Domain.Models.DevelopersAndPublishers;
using SteamClone.Domain.Models.Games;
using SteamClone.Domain.Models.UserGameLibraries;
using SteamClone.Domain.Models.Wishlists;
using SteamClone.Domain.ViewModels.Games;
using SteamClone.Domain.ViewModels.Games.Localizations;
using SteamClone.Domain.ViewModels.Games.SystemReq;
using SteamClone.Domain.ViewModels.Users;

namespace SteamClone.BLL.Services.GameService;

public class GameService(
    IGameRepository gameRepository,
    IMapper mapper,
    IGenreRepository genreRepository,
    IDeveloperAndPublisherRepository developerAndPublisherRepository,
    IImageService imageService,
    IHttpContextAccessor httpContextAccessor,
    ISystemRequirementsRepo systemRequirementsRepo,
    ILocalizationRepository localizationRepository,
    ILanguageRepository languageRepository,
    IUserRepository userRepository,
    IUserProvider userProvider,
    IBalanceRepository balanceRepository,
    IUserGameLibraryRepository userGameLibraryRepository,
    IWishlistRepository wishlistRepository)
    : IGameService
{
    public async Task<ServiceResponse> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var games = (await gameRepository.GetAllAsync(cancellationToken))
            .Where(x => x.IsApproved == true);

        return ServiceResponse.OkResponse("Games retrieved successfully", mapper.Map<List<GameVM>>(games));
    }

    public async Task<ServiceResponse> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        var game = await gameRepository.GetByIdAsync(id, cancellationToken);

        if (game == null)
        {
            return ServiceResponse.NotFoundResponse("Game not found");
        }

        return ServiceResponse.OkResponse("Game retrieved successfully", mapper.Map<GameVM>(game));
    }

    public async Task<ServiceResponse> CreateAsync(CreateGameVM model, CancellationToken cancellationToken = default)
    {
        var game = mapper.Map<Game>(model);

        game.Id = Guid.NewGuid().ToString();
        game.ReleaseDate = model.ReleaseDate ?? DateTime.UtcNow;

        foreach (var genreId in model.GenresIds.Distinct())
        {
            var genre = await genreRepository.GetByIdAsync(genreId, cancellationToken);

            if (genre == null)
            {
                return ServiceResponse.NotFoundResponse($"Genre with id '{genreId}' not found");
            }

            game.Genres.Add(genre);
        }

        var developer = await developerAndPublisherRepository.GetByIdAsync(model.DeveloperId, cancellationToken);

        if (developer == null)
        {
            return ServiceResponse.NotFoundResponse($"Developer with id '{model.DeveloperId}' not found");
        }

        if (!await HasAccessToDeveloperOrPublisherAsync(developer))
        {
            return ServiceResponse.ForbiddenResponse("You don't have permission to create a game with this developer");
        }

        if (model.PublisherId != null)
        {
            var publisher = await developerAndPublisherRepository.GetByIdAsync(model.PublisherId, cancellationToken);
            if (publisher == null)
            {
                return ServiceResponse.NotFoundResponse($"Publisher with id '{model.PublisherId}' not found");
            }

            if (!await HasAccessToDeveloperOrPublisherAsync(publisher))
            {
                return ServiceResponse.ForbiddenResponse(
                    "You don't have permission to create a game with this publisher");
            }
        }

        game.PublisherId = model.PublisherId ?? game.DeveloperId;

        var userRole = userProvider.GetUserRole();

        if (userRole == Settings.Roles.AdminRole)
        {
            game.IsApproved = true;
        }

        var user = await userRepository.GetByIdAsync(await userProvider.GetUserId(), cancellationToken);
        game.AssociatedUsers.Add(user!);

        try
        {
            var createdGame = await gameRepository.CreateAsync(game, cancellationToken);
            return ServiceResponse.OkResponse("Game created successfully", mapper.Map<GameVM>(createdGame));
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<ServiceResponse> UpdateAsync(string id, UpdateGameVM model,
        CancellationToken cancellationToken = default)
    {
        var existingGame = await gameRepository.GetByIdAsync(id, cancellationToken);

        if (existingGame == null)
        {
            return ServiceResponse.NotFoundResponse("Game not found");
        }

        var userRole = userProvider.GetUserRole();
        var userId = await userProvider.GetUserId();

        if (!(existingGame.AssociatedUsers.Any(x => x.Id == userId)) && userRole != Settings.Roles.AdminRole)
        {
            return ServiceResponse.ForbiddenResponse("You don't have permission to update this game");
        }

        existingGame.Genres.Clear();
        foreach (var genreId in model.GenresIds.Distinct())
        {
            var genre = await genreRepository.GetByIdAsync(genreId, cancellationToken);
            if (genre == null)
            {
                return ServiceResponse.NotFoundResponse($"Genre with id '{genreId}' not found");
            }

            existingGame.Genres.Add(genre);
        }

        var updatedGame = mapper.Map(model, existingGame);
        updatedGame.ReleaseDate = model.ReleaseDate ?? DateTime.UtcNow;

        var developer = await developerAndPublisherRepository.GetByIdAsync(model.DeveloperId, cancellationToken);

        if (developer == null)
        {
            return ServiceResponse.NotFoundResponse($"Developer with id '{model.DeveloperId}' not found");
        }

        if (!await HasAccessToDeveloperOrPublisherAsync(developer) && existingGame.DeveloperId != model.DeveloperId)
        {
            return ServiceResponse.ForbiddenResponse("You don't have permission to create a game with this developer");
        }

        if (model.PublisherId != null)
        {
            var publisher = await developerAndPublisherRepository.GetByIdAsync(model.PublisherId, cancellationToken);
            if (publisher == null)
            {
                return ServiceResponse.NotFoundResponse($"Publisher with id '{model.PublisherId}' not found");
            }

            if (!await HasAccessToDeveloperOrPublisherAsync(publisher) && existingGame.PublisherId != model.PublisherId)
            {
                return ServiceResponse.ForbiddenResponse(
                    "You don't have permission to create a game with this publisher");
            }
        }

        updatedGame.PublisherId = model.PublisherId ?? updatedGame.DeveloperId;

        return await UpdateGameAsync(updatedGame, "Game updated successfully", cancellationToken);
    }

    public async Task<ServiceResponse> DeleteAsync(string id, CancellationToken cancellationToken = default)
    {
        try
        {
            var game = await gameRepository.GetByIdAsync(id, cancellationToken);
            if (game == null)
            {
                return ServiceResponse.NotFoundResponse("Game not found");
            }

            if (!await HasAccessToGameAsync(game))
            {
                return ServiceResponse.ForbiddenResponse("You don't have permission to update this game");
            }

            DeleteImagesByGame(game);

            await gameRepository.DeleteAsync(id, cancellationToken);
            return ServiceResponse.OkResponse("Game deleted successfully");
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    private void DeleteImagesByGame(Game game)
    {
        foreach (var gameScreenshotUrl in game.ScreenshotUrls)
        {
            imageService.DeleteImage(Settings.ImagesPathSettings.GameScreenshotImagePath,
                gameScreenshotUrl.Split("/").Last());
        }

        if (game.CoverImageUrl != null)
            imageService.DeleteImage(Settings.ImagesPathSettings.GameCoverImagePath,
                game.CoverImageUrl.Split("/").Last());
    }

    public async Task<ServiceResponse> AddSystemRequirementsAsync(CreateUpdateSystemReqVm model,
        CancellationToken cancellationToken)
    {
        var game = await gameRepository.GetByIdAsync(model.GameId, cancellationToken);

        if (game == null)
        {
            return ServiceResponse.NotFoundResponse("Game not found");
        }

        if (ValidateRequirementModel(model) != null)
        {
            return ValidateRequirementModel(model)!;
        }

        if (game.SystemRequirements.Any(x =>
                x.RequirementType == model.RequirementType && x.Platform == model.Platform))
        {
            return ServiceResponse.BadRequestResponse(
                $"System requirements with type '{model.RequirementType}' and platform '{model.Platform}' already exists");
        }

        var systemRequirements = mapper.Map<SystemRequirements>(model);

        systemRequirements.Id = Guid.NewGuid().ToString();

        game.SystemRequirements.Add(systemRequirements);

        return await UpdateGameAsync(game, "System requirements added successfully", cancellationToken);
    }

    public async Task<ServiceResponse> DeleteSystemRequirementsAsync(string systemRequirementId,
        CancellationToken cancellationToken)
    {
        var systemRequirement = await systemRequirementsRepo.GetByIdAsync(systemRequirementId, cancellationToken);

        if (systemRequirement == null)
        {
            return ServiceResponse.NotFoundResponse("System requirement not found");
        }

        try
        {
            await systemRequirementsRepo.DeleteAsync(systemRequirementId, cancellationToken);

            return ServiceResponse.OkResponse("System requirement deleted successfully");
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<ServiceResponse> UpdateSystemRequirementsAsync(string systemRequirementId,
        UpdateSystemReqVM model,
        CancellationToken cancellationToken)
    {
        var systemRequirement = await systemRequirementsRepo.GetByIdAsync(systemRequirementId, cancellationToken);

        if (systemRequirement == null)
        {
            return ServiceResponse.NotFoundResponse("System requirement not found");
        }

        var game = await gameRepository.GetByIdAsync(systemRequirement.GameId, cancellationToken, asNoTracking: true);

        if (ValidateRequirementModel(model) != null)
        {
            return ValidateRequirementModel(model)!;
        }

        if (game!.SystemRequirements.Any(x =>
                x.RequirementType == model.RequirementType && x.Platform == model.Platform &&
                x.Id != systemRequirementId))
        {
            return ServiceResponse.BadRequestResponse(
                $"System requirements with type '{model.RequirementType}' and platform '{model.Platform}' already exists");
        }

        var updSystemRequirement = mapper.Map(model, systemRequirement);

        try
        {
            await systemRequirementsRepo.UpdateAsync(updSystemRequirement, cancellationToken);

            return ServiceResponse.OkResponse("System requirements updated successfully", updSystemRequirement);
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<ServiceResponse> UpdateCoverImageAsync(string gameId, IFormFile coverImage,
        CancellationToken cancellationToken)
    {
        var game = await gameRepository.GetByIdAsync(gameId, cancellationToken);

        if (game == null)
        {
            return ServiceResponse.NotFoundResponse("Game not found");
        }

        var imageName = game.CoverImageUrl?.Split('/').LastOrDefault();

        var newImageName =
            await imageService.SaveImageFromFileAsync(Settings.ImagesPathSettings.GameCoverImagePath, coverImage,
                imageName);

        if (newImageName == null)
        {
            return ServiceResponse.BadRequestResponse("No image uploaded");
        }

        var baseUrl =
            $"{httpContextAccessor.HttpContext!.Request.Scheme}://{httpContextAccessor.HttpContext.Request.Host}/";

        game.CoverImageUrl = $"{baseUrl}{Settings.ImagesPathSettings.GameCoverImagePathForUrl}/{newImageName}";

        return await UpdateGameAsync(game, "Cover image updated successfully", cancellationToken);
    }

    public async Task<ServiceResponse> UpdateScreenshotsImagesAsync(string gameId, IFormFileCollection newScreenshots,
        List<string> screenshotsToDelete,
        CancellationToken cancellationToken)
    {
        var game = await gameRepository.GetByIdAsync(gameId, cancellationToken);

        if (game == null)
        {
            return ServiceResponse.NotFoundResponse("Game not found");
        }

        foreach (var id in screenshotsToDelete)
        {
            var image = game.ScreenshotUrls.FirstOrDefault(x => x.Contains(id));
            if (image != null)
            {
                var imageName = image.Split('/').LastOrDefault();
                imageService.DeleteImage(Settings.ImagesPathSettings.GameScreenshotImagePath, imageName!);
                game.ScreenshotUrls.Remove(image);
            }
        }

        var savedImages =
            await imageService.SaveImagesFromFilesAsync(Settings.ImagesPathSettings.GameScreenshotImagePath,
                newScreenshots);

        var baseUrl =
            $"{httpContextAccessor.HttpContext!.Request.Scheme}://{httpContextAccessor.HttpContext.Request.Host}/";

        foreach (var fileName in savedImages)
        {
            game.ScreenshotUrls.Add($"{baseUrl}{Settings.ImagesPathSettings.GameScreenshotImagePathForUrl}/{fileName}");
        }

        return await UpdateGameAsync(game, "Screenshots updated successfully", cancellationToken);
    }

    public async Task<ServiceResponse> AddLocalizationAsync(CreateLocalizationVM model,
        CancellationToken cancellationToken)
    {
        var game = await gameRepository.GetByIdAsync(model.GameId, cancellationToken);

        if (game == null)
        {
            return ServiceResponse.NotFoundResponse("Game not found");
        }

        var language = await languageRepository.GetByIdAsync(model.LanguageId, cancellationToken);

        if (language == null)
        {
            return ServiceResponse.NotFoundResponse("Language not found");
        }

        if (game.Localizations.Any(x => x.LanguageId == model.LanguageId))
        {
            return ServiceResponse.BadRequestResponse($"Localization with language '{language.Name}' already exists");
        }

        if (model is { FullAudio: false, Interface: false, Subtitles: false })
        {
            return ServiceResponse.BadRequestResponse("At least one field must be true");
        }

        var localization = mapper.Map<Localization>(model);
        localization.Id = Guid.NewGuid().ToString();

        try
        {
            await localizationRepository.CreateAsync(localization, cancellationToken);

            return ServiceResponse.OkResponse("Localization created successfully", localization);
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<ServiceResponse> UpdateLocalizationAsync(string localizationId, UpdateLocalizationVM model,
        CancellationToken cancellationToken)
    {
        var localization = await localizationRepository.GetByIdAsync(localizationId, cancellationToken);

        if (localization == null)
        {
            return ServiceResponse.NotFoundResponse("Localization not found");
        }

        if (model is { FullAudio: false, Interface: false, Subtitles: false })
        {
            return ServiceResponse.BadRequestResponse("At least one field must be true");
        }

        var updLocalization = mapper.Map(model, localization);

        try
        {
            await localizationRepository.UpdateAsync(updLocalization, cancellationToken);

            return ServiceResponse.OkResponse("Localization updated successfully", updLocalization);
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<ServiceResponse> DeleteLocalizationAsync(string localizationId,
        CancellationToken cancellationToken)
    {
        var localization = await localizationRepository.GetByIdAsync(localizationId, cancellationToken);

        if (localization == null)
        {
            return ServiceResponse.NotFoundResponse("Localization not found");
        }

        try
        {
            await localizationRepository.DeleteAsync(localizationId, cancellationToken);

            return ServiceResponse.OkResponse("Localization deleted successfully");
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<ServiceResponse> AssociateUserAsync(string gameId, string userId, CancellationToken token)
    {
        var user = await userRepository.GetByIdAsync(userId, token);

        if (user == null)
        {
            return ServiceResponse.NotFoundResponse("User not found");
        }

        if (user.RoleId != Settings.Roles.ManagerRole)
        {
            return ServiceResponse.BadRequestResponse("User must have Manager role");
        }

        var game = await gameRepository.GetByIdAsync(gameId, token);

        if (game == null)
        {
            return ServiceResponse.NotFoundResponse("Game not found");
        }

        if (!await IsOwnerAsync(gameId, token))
        {
            return ServiceResponse.ForbiddenResponse("You don't have permission to associate users");
        }

        game.AssociatedUsers.Add(user);

        return await UpdateGameAsync(game, "User associated successfully", token);
    }

    public async Task<ServiceResponse> RemoveAssociatedUserAsync(string gameId, string userId, CancellationToken token)
    {
        var user = await userRepository.GetByIdAsync(userId, token);

        if (user == null)
        {
            return ServiceResponse.NotFoundResponse("User not found");
        }

        var game = await gameRepository.GetByIdAsync(gameId, token);

        if (game == null)
        {
            return ServiceResponse.NotFoundResponse("Game not found");
        }

        if (!await IsOwnerAsync(gameId, token))
        {
            return ServiceResponse.ForbiddenResponse("You don't have permission to remove associated users");
        }

        game.AssociatedUsers.Remove(user);

        return await UpdateGameAsync(game, "User association removed successfully", token);
    }

    public async Task<ServiceResponse> GetByAssociatedUserAsync(bool? isApproved = true, CancellationToken token = default)
    {
        var userId = await userProvider.GetUserId();

        return await GetByAssociatedUserIdAsync(isApproved, userId, token);
    }

    private async Task<ServiceResponse> GetByAssociatedUserIdAsync(bool? isApproved, string id, CancellationToken token)
    {
        var games = await gameRepository.GetAllAsync(token);
        var gamesByAssociatedUser = games
            .Where(d => d.AssociatedUsers.Any(u => u.Id == id) && d.IsApproved == isApproved);

        return ServiceResponse.OkResponse("Games by associated user retrieved successfully",
            mapper.Map<List<GameVM>>(gamesByAssociatedUser));
    }

    public async Task<ServiceResponse> ApproveAsync(string id, bool isApproved, CancellationToken token)
    {
        var game = await gameRepository.GetByIdAsync(id, token);

        if (game == null)
        {
            return ServiceResponse.NotFoundResponse("Game not found");
        }

        if ((await userGameLibraryRepository.GetAllByGameIdAsync(game.Id, token)).Any())
        {
            return ServiceResponse.BadRequestResponse("Game has already been bought");
        }

        game.IsApproved = isApproved;

        return await UpdateGameAsync(game,
            "Game approval set successfully", token);
    }

    public async Task<ServiceResponse> GetWithoutApprovalAsync(CancellationToken token)
    {
        var games = (await gameRepository.GetAllAsync(token))
            .Where(x => x.IsApproved.HasValue == false);

        return ServiceResponse.OkResponse("Games without approval retrieved successfully",
            mapper.Map<List<GameVM>>(games));
    }

    public async Task<ServiceResponse> BuyGameAsync(string id, CancellationToken token)
    {
        var game = await gameRepository.GetByIdAsync(id, token);

        if (game == null)
        {
            return ServiceResponse.NotFoundResponse("Game not found");
        }

        var buyerId = await userProvider.GetUserId();

        if (await userGameLibraryRepository.GetAsync(buyerId, game.Id, token, asNoTracking: true) != null)
        {
            return ServiceResponse.BadRequestResponse("Game has already been bought");
        }

        try
        {
            if (await wishlistRepository.GetByUserIdAndGameIdAsync(buyerId, game.Id, token, asNoTracking: true) != null)
            {
                await wishlistRepository.DeleteAsync(new Wishlist { GameId = game.Id, UserId = buyerId }, token);
            }

            decimal amountToWithdraw =
                game.Discount != null ? game.Price * (1 - (decimal)game.Discount / 100) : game.Price;

            if (!(await balanceRepository.WithdrawAsync(buyerId, amountToWithdraw, token)))
            {
                return ServiceResponse.BadRequestResponse("Not enough money");
            }

            await userGameLibraryRepository.CreateAsync(new UserGameLibrary
            {
                UserId = buyerId,
                GameId = id
            }, token);

            return ServiceResponse.OkResponse("Game bought successfully");
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<ServiceResponse> IsGameBoughtAsync(string gameId, CancellationToken token)
    {
        if (await gameRepository.GetByIdAsync(gameId, token, true) == null)
        {
            return ServiceResponse.NotFoundResponse("Game not found");
        }

        var isBought = (await userGameLibraryRepository.GetAllByGameIdAsync(gameId, token)).Any();

        return ServiceResponse.OkResponse("Game bought status retrieved successfully", isBought);
    }

    public async Task<ServiceResponse> GetAssociatedUsersAsync(string gameId, CancellationToken token)
    {
        var game = await gameRepository.GetByIdAsync(gameId, token);

        if (game == null)
        {
            return ServiceResponse.NotFoundResponse("Game not found");
        }

        return ServiceResponse.OkResponse("Associated users retrieved successfully",
            mapper.Map<List<UserVM>>(
                game.AssociatedUsers
                .Where(x => FilterAssociatedUsersAsync(gameId, x.Id, x.RoleId, token).Result)
            ));
    }

    public async Task<ServiceResponse> IsGameOwnerAsync(string gameId, CancellationToken token)
    {
        if (await gameRepository.GetByIdAsync(gameId, token, true) == null)
        {
            return ServiceResponse.NotFoundResponse("Game not found");
        }

        return ServiceResponse.OkResponse("Game owner status retrieved successfully",
            await IsOwnerAsync(gameId, token));
    }

    private async Task<ServiceResponse> UpdateGameAsync(Game game, string successMessage,
        CancellationToken cancellationToken)
    {
        try
        {
            var result = await gameRepository.UpdateAsync(game, cancellationToken);
            return ServiceResponse.OkResponse(successMessage, mapper.Map<GameVM>(result));
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    private ServiceResponse? ValidateRequirementModel(UpdateSystemReqVM model)
    {
        if (Enum.GetValues<RequirementType>().All(x => x != model.RequirementType))
            return ServiceResponse.BadRequestResponse($"Invalid requirement type '{model.RequirementType}'");
        if (Enum.GetValues<RequirementPlatform>().All(x => x != model.Platform))
            return ServiceResponse.BadRequestResponse($"Invalid platform '{model.Platform}'");
        if (model is
            {
                DirectX: "", Graphics: "", Memory: "",
                Network: "", OS: "", Processor: "", Storage: ""
            })
            return ServiceResponse.BadRequestResponse("At least one requirement must be specified");
        return null;
    }

    private async Task<bool> HasAccessToDeveloperOrPublisherAsync(DeveloperAndPublisher developerAndPublisher)
    {
        var userRole = userProvider.GetUserRole();
        var userId = await userProvider.GetUserId();
        return developerAndPublisher.AssociatedUsers.Any(x => x.Id == userId) || userRole == Settings.Roles.AdminRole;
    }

    private async Task<bool> HasAccessToGameAsync(Game game)
    {
        var userRole = userProvider.GetUserRole();
        var userId = await userProvider.GetUserId();
        return game.AssociatedUsers.Any(x => x.Id == userId) || userRole == Settings.Roles.AdminRole;
    }

    private async Task<bool> IsOwnerAsync(string gameId, CancellationToken token = default)
    {
        var userRole = userProvider.GetUserRole();
        var userId = await userProvider.GetUserId();

        var game = await gameRepository.GetByIdAsync(gameId, token);

        if (userRole == Settings.Roles.AdminRole)
            return true;

        if (game!.CreatedBy == userId)
        {
            return true;
        }

        var creator = await userRepository.GetByIdAsync(game.CreatedBy!, token);

        if (creator!.RoleId == Settings.Roles.AdminRole && game.AssociatedUsers.Any(x => x.Id == userId))
        {
            return true;
        }

        return false;
    }

    private async Task<bool> FilterAssociatedUsersAsync(string gameId, string userId, string userRole,
        CancellationToken token = default)
    {
        if (userRole == Settings.Roles.AdminRole)
        {
            return false;
        }

        if (userProvider.GetUserRole() != Settings.Roles.AdminRole)
        {
            var game = await gameRepository.GetByIdAsync(gameId, token);

            if (game!.CreatedBy == userId)
            {
                return false;
            }

            var currentUserId = await userProvider.GetUserId();
            
            if (game.CreatedBy != currentUserId)
            {
                if (currentUserId == userId)
                    return false;
            }
        }

        return true;
    }
}