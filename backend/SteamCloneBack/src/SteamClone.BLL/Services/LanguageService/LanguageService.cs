using AutoMapper;
using SteamClone.DAL.Repositories.LanguageRepository;
using SteamClone.Domain.Models.Languages;
using SteamClone.Domain.ViewModels.Languages;

namespace SteamClone.BLL.Services.LanguageService;

public class LanguageService(ILanguageRepository languageRepository, IMapper mapper) : ILanguageService
{
    public async Task<ServiceResponse> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var languages = await languageRepository.GetAllAsync(cancellationToken);
        
        return ServiceResponse.OkResponse("Languages retrieved successfully", mapper.Map<List<LanguageVM>>(languages));
    }

    public async Task<ServiceResponse> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var language = await languageRepository.GetByIdAsync(id, cancellationToken);
        
        if (language == null)
        {
            return ServiceResponse.NotFoundResponse("Language not found");
        }

        return ServiceResponse.OkResponse("Language retrieved successfully", mapper.Map<LanguageVM>(language));
    }

    public async Task<ServiceResponse> CreateAsync(CreateUpdateLanguageVM model, CancellationToken cancellationToken = default)
    {
        var language = mapper.Map<Language>(model);
        
        var uniquenessError = await languageRepository.CheckForUniqueness(language, cancellationToken);

        if (uniquenessError is not null)
        {
            return ServiceResponse.BadRequestResponse($"Language with this {uniquenessError} already exists");
        }
        
        var createdLanguage = await languageRepository.CreateAsync(language, cancellationToken);
        
        if (createdLanguage == null)
        {
            return ServiceResponse.BadRequestResponse("Failed to create language");
        }

        return ServiceResponse.OkResponse("Language created successfully", mapper.Map<LanguageVM>(createdLanguage));
    }

    public async Task<ServiceResponse> UpdateAsync(int id, CreateUpdateLanguageVM model, CancellationToken cancellationToken = default)
    {
        var existingLanguage = await languageRepository.GetByIdAsync(id, cancellationToken, asNoTracking: true);
        
        if (existingLanguage == null)
        {
            return ServiceResponse.NotFoundResponse("Language not found");
        }

        var updatedLanguage = mapper.Map(model, existingLanguage);
        
        var uniquenessError = await languageRepository.CheckForUniqueness(updatedLanguage, cancellationToken);

        if (uniquenessError is not null)
        {
            return ServiceResponse.BadRequestResponse($"Language with this {uniquenessError} already exists");
        }
        
        var result = await languageRepository.UpdateAsync(updatedLanguage, cancellationToken);
        
        if (result == null)
        {
            return ServiceResponse.BadRequestResponse("Failed to update language");
        }

        return ServiceResponse.OkResponse("Language updated successfully", mapper.Map<LanguageVM>(result));
    }

    public async Task<ServiceResponse> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        try
        {
            var language = await languageRepository.GetByIdAsync(id, cancellationToken);
            if (language == null)
            {
                return ServiceResponse.NotFoundResponse("Language not found");
            }
            await languageRepository.DeleteAsync(id, cancellationToken);
            return ServiceResponse.OkResponse("Language deleted successfully");
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }
}