using AutoMapper;
using SteamClone.DAL.Repositories.GenreRepository;
using SteamClone.Domain.Models.Games;
using SteamClone.Domain.ViewModels.Games;

namespace SteamClone.BLL.Services.GenreService;

public class GenreService(IGenreRepository genreRepository, IMapper mapper) : IGenreService
{
    public async Task<ServiceResponse> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var genres = await genreRepository.GetAllAsync(cancellationToken);
        
        return ServiceResponse.OkResponse("Genres retrieved successfully", genres);
    }

    public async Task<ServiceResponse> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var genre = await genreRepository.GetByIdAsync(id, cancellationToken);
        
        if (genre == null)
        {
            return ServiceResponse.NotFoundResponse("Genre not found");
        }

        return ServiceResponse.OkResponse("Genre retrieved successfully", genre);
    }

    public async Task<ServiceResponse> CreateAsync(CreateUpdateGenreVM model, CancellationToken cancellationToken = default)
    {
        var genre = mapper.Map<Genre>(model);
        
        var createdGenre = await genreRepository.CreateAsync(genre, cancellationToken);
        
        if (createdGenre == null)
        {
            return ServiceResponse.BadRequestResponse("Failed to create genre");
        }

        return ServiceResponse.OkResponse("Genre created successfully", createdGenre);
    }

    public async Task<ServiceResponse> UpdateAsync(int id, CreateUpdateGenreVM model, CancellationToken cancellationToken = default)
    {
        var existingGenre = await genreRepository.GetByIdAsync(id, cancellationToken, asNoTracking: true);
        
        if (existingGenre == null)
        {
            return ServiceResponse.NotFoundResponse("Genre not found");
        }

        var updatedGenre = mapper.Map(model, existingGenre);
        
        var result = await genreRepository.UpdateAsync(updatedGenre, cancellationToken);
        
        if (result == null)
        {
            return ServiceResponse.BadRequestResponse("Failed to update genre");
        }

        return ServiceResponse.OkResponse("Genre updated successfully", result);
    }

    public async Task<ServiceResponse> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var genre = await genreRepository.DeleteAsync(id, cancellationToken);
        
        if (genre == null)
        {
            return ServiceResponse.NotFoundResponse("Genre not found");
        }

        return ServiceResponse.OkResponse("Genre deleted successfully", genre);
    }
}