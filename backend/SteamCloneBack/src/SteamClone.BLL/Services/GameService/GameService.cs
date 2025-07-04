using AutoMapper;
using SteamClone.DAL.Repositories.GameRepository;
using SteamClone.DAL.Repositories.GenreRepository;
using SteamClone.Domain.Models.Games;
using SteamClone.Domain.ViewModels.Games;

namespace SteamClone.BLL.Services.GameService;

public class GameService(IGameRepository gameRepository, IMapper mapper, IGenreRepository genreRepository) : IGameService
{
    public async Task<ServiceResponse> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var games = await gameRepository.GetAllAsync(cancellationToken);

        return ServiceResponse.OkResponse("Games retrieved successfully", games);
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
}