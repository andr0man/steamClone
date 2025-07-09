using AutoMapper;
using Microsoft.AspNetCore.Http;
using SteamClone.BLL.Services.DeveloperAndPublisherService;
using SteamClone.BLL.Services.ImageService;
using SteamClone.DAL;
using SteamClone.DAL.Repositories.DeveloperAndPublisherRepository;
using SteamClone.DAL.Repositories.GameRepository;
using SteamClone.DAL.Repositories.GenreRepository;
using SteamClone.Domain.Models.Games;
using SteamClone.Domain.ViewModels.Games;
using SteamClone.Domain.ViewModels.Games.SystemReq;

namespace SteamClone.BLL.Services.GameService;

public class GameService(
    IGameRepository gameRepository,
    IMapper mapper,
    IGenreRepository genreRepository,
    IDeveloperAndPublisherRepository developerAndPublisherRepository,
    IImageService imageService,
    IHttpContextAccessor httpContextAccessor)
    : IGameService
{
    public async Task<ServiceResponse> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var games = await gameRepository.GetAllAsync(cancellationToken);

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

        if (await developerAndPublisherRepository.GetByIdAsync(model.DeveloperId, cancellationToken) == null)
        {
            return ServiceResponse.NotFoundResponse($"Developer with id '{model.DeveloperId}' not found");
        }

        if (model.PublisherId != null && await developerAndPublisherRepository.GetByIdAsync(model.PublisherId,
                cancellationToken) == null)
        {
            return ServiceResponse.NotFoundResponse($"Publisher with id '{model.PublisherId}' not found");
        }

        game.PublisherId = model.PublisherId ?? game.DeveloperId;

        try
        {
            var createdGame = await gameRepository.CreateAsync(game, cancellationToken);
            return ServiceResponse.OkResponse("Game created successfully", createdGame);
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

        if (await developerAndPublisherRepository.GetByIdAsync(model.DeveloperId, cancellationToken) == null)
        {
            return ServiceResponse.NotFoundResponse($"Developer with id '{model.DeveloperId}' not found");
        }

        if (model.PublisherId != null && await developerAndPublisherRepository.GetByIdAsync(model.PublisherId,
                cancellationToken) == null)
        {
            return ServiceResponse.NotFoundResponse($"Publisher with id '{model.PublisherId}' not found");
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

            await gameRepository.DeleteAsync(id, cancellationToken);
            return ServiceResponse.OkResponse("Game deleted successfully");
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<ServiceResponse> AddSystemRequirementsAsync(string gameId, SystemReqCreateUpdateVM model,
        CancellationToken cancellationToken)
    {
        var game = await gameRepository.GetByIdAsync(gameId, cancellationToken);

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

    public async Task<ServiceResponse> DeleteSystemRequirementsAsync(string gameId, string systemRequirementId,
        CancellationToken cancellationToken)
    {
        var game = await gameRepository.GetByIdAsync(gameId, cancellationToken);

        if (game == null)
        {
            return ServiceResponse.NotFoundResponse("Game not found");
        }

        game.SystemRequirements.RemoveAll(x => x.Id == systemRequirementId);

        return await UpdateGameAsync(game, "System requirements deleted successfully", cancellationToken);
    }

    public async Task<ServiceResponse> UpdateSystemRequirementsAsync(string gameId, string systemRequirementId,
        SystemReqCreateUpdateVM model,
        CancellationToken cancellationToken)
    {
        var game = await gameRepository.GetByIdAsync(gameId, cancellationToken);

        if (game == null)
        {
            return ServiceResponse.NotFoundResponse("Game not found");
        }

        if (ValidateRequirementModel(model) != null)
        {
            return ValidateRequirementModel(model)!;
        }

        if (game.SystemRequirements.Any(x =>
                x.RequirementType == model.RequirementType && x.Platform == model.Platform &&
                x.Id != systemRequirementId))
        {
            return ServiceResponse.BadRequestResponse(
                $"System requirements with type '{model.RequirementType}' and platform '{model.Platform}' already exists");
        }

        game.SystemRequirements.RemoveAll(x => x.Id == systemRequirementId);

        var systemRequirements = mapper.Map<SystemRequirements>(model);
        systemRequirements.Id = systemRequirementId;
        game.SystemRequirements.Add(systemRequirements);

        return await UpdateGameAsync(game, "System requirements updated successfully", cancellationToken);
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

    private async Task<ServiceResponse> UpdateGameAsync(Game game, string successMessage,
        CancellationToken cancellationToken)
    {
        try
        {
            var result = await gameRepository.UpdateAsync(game, cancellationToken);
            return ServiceResponse.OkResponse(successMessage, result);
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    private ServiceResponse? ValidateRequirementModel(SystemReqCreateUpdateVM model)
    {
        if (Enum.GetValues<RequirementType>().All(x => x != model.RequirementType))
            return ServiceResponse.BadRequestResponse($"Invalid requirement type '{model.RequirementType}'");
        if (Enum.GetValues<RequirementPlatform>().All(x => x != model.Platform))
            return ServiceResponse.BadRequestResponse($"Invalid platform '{model.Platform}'");
        return null;
    }
}