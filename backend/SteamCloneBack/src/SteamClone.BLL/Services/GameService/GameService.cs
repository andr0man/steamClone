using AutoMapper;
using SteamClone.DAL.Repositories.GameRepository;
using SteamClone.DAL.Repositories.GenreRepository;
using SteamClone.Domain.Models.Games;
using SteamClone.Domain.ViewModels.Games;
using SteamClone.Domain.ViewModels.Games.SystemReq;

namespace SteamClone.BLL.Services.GameService;

public class GameService(IGameRepository gameRepository, IMapper mapper, IGenreRepository genreRepository)
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

        return ServiceResponse.OkResponse("Game retrieved successfully", game);
    }

    public async Task<ServiceResponse> CreateAsync(CreateGameVM model, CancellationToken cancellationToken = default)
    {
        var game = mapper.Map<Game>(model);

        game.Id = Guid.NewGuid().ToString();
        game.ReleaseDate = DateTime.UtcNow;

        foreach (var genreId in model.GenresIds)
        {
            var genre = await genreRepository.GetByIdAsync(genreId, cancellationToken);
            game.Genres.Add(genre);
        }

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

        var updatedGame = mapper.Map(model, existingGame);

        try
        {
            var result = await gameRepository.UpdateAsync(updatedGame, cancellationToken);

            return ServiceResponse.OkResponse("Game updated successfully", result);
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
            var game = await gameRepository.DeleteAsync(id, cancellationToken);

            return ServiceResponse.OkResponse("Game deleted successfully", game);
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

        if (Enum.GetValues<RequirementType>().All(x => x != model.RequirementType))
        {
            return ServiceResponse.BadRequestResponse($"Invalid requirement type {model.RequirementType}");
        }

        if (Enum.GetValues<RequirementPlatform>().All(x => x != model.Platform))
        {
            return ServiceResponse.BadRequestResponse($"Invalid platform {model.Platform}");
        }

        if (game.SystemRequirements.Any(x =>
                x.RequirementType == model.RequirementType && x.Platform == model.Platform))
        {
            return ServiceResponse.BadRequestResponse(
                $"System requirements with type {model.RequirementType} and platform {model.Platform} already exists");
        }

        var systemRequirements = mapper.Map<SystemRequirements>(model);

        systemRequirements.Id = Guid.NewGuid().ToString();

        game.SystemRequirements.Add(systemRequirements);

        try
        {
            var result = await gameRepository.UpdateAsync(game, cancellationToken);

            return ServiceResponse.OkResponse("System requirements added successfully", result);
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
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

        try
        {
            var result = await gameRepository.UpdateAsync(game, cancellationToken);

            return ServiceResponse.OkResponse("System requirements added successfully", result);
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
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

        if (Enum.GetValues<RequirementType>().All(x => x != model.RequirementType))
        {
            return ServiceResponse.BadRequestResponse($"Invalid requirement type {model.RequirementType}");
        }

        if (Enum.GetValues<RequirementPlatform>().All(x => x != model.Platform))
        {
            return ServiceResponse.BadRequestResponse($"Invalid platform {model.Platform}");
        }

        if (game.SystemRequirements.Any(x =>
                x.RequirementType == model.RequirementType && x.Platform == model.Platform && x.Id != systemRequirementId))
        {
            return ServiceResponse.BadRequestResponse(
                $"System requirements with type {model.RequirementType} and platform {model.Platform} already exists");
        }

        game.SystemRequirements.RemoveAll(x => x.Id == systemRequirementId);
        
        var systemRequirements = mapper.Map<SystemRequirements>(model);
        systemRequirements.Id = systemRequirementId;
        game.SystemRequirements.Add(systemRequirements);
        
        try
        {
            var result = await gameRepository.UpdateAsync(game, cancellationToken);

            return ServiceResponse.OkResponse("System requirements added successfully", result);
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }
}