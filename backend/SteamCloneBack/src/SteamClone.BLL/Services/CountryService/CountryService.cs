using AutoMapper;
using SteamClone.DAL.Repositories.CountryRepository;
using SteamClone.Domain.Models;
using SteamClone.Domain.Models.Auth;
using SteamClone.Domain.Models.Countries;
using SteamClone.Domain.ViewModels.Countries;

namespace SteamClone.BLL.Services.CountryService;

public class CountryService(ICountryRepository countryRepository, IMapper mapper) : ICountryService
{
    public async Task<ServiceResponse> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var countries = await countryRepository.GetAllAsync(cancellationToken);
        
        return ServiceResponse.OkResponse("Countries retrieved successfully", mapper.Map<List<CountryVM>>(countries));
    }

    public async Task<ServiceResponse> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var country = await countryRepository.GetByIdAsync(id, cancellationToken);
        
        if (country == null)
        {
            return ServiceResponse.NotFoundResponse("Country not found");
        }

        return ServiceResponse.OkResponse("Country retrieved successfully", mapper.Map<CountryVM>(country));
    }

    public async Task<ServiceResponse> CreateAsync(CreateUpdateCountryVM model, CancellationToken cancellationToken = default)
    {
        var country = mapper.Map<Country>(model);
        
        var uniquenessError = await countryRepository.CheckForUniqueness(country, cancellationToken);

        if (uniquenessError is not null)
        {
            return ServiceResponse.BadRequestResponse($"Country with this {uniquenessError} already exists");
        }
        
        var createdCountry = await countryRepository.CreateAsync(country, cancellationToken);
        
        if (createdCountry == null)
        {
            return ServiceResponse.BadRequestResponse("Failed to create country");
        }

        return ServiceResponse.OkResponse("Country created successfully", mapper.Map<CountryVM>(createdCountry));
    }

    public async Task<ServiceResponse> UpdateAsync(int id, CreateUpdateCountryVM model, CancellationToken cancellationToken = default)
    {
        var existingCountry = await countryRepository.GetByIdAsync(id, cancellationToken, asNoTracking: true);
        
        if (existingCountry == null)
        {
            return ServiceResponse.NotFoundResponse("Country not found");
        }

        var updatedCountry = mapper.Map(model, existingCountry);
        
        var uniquenessError = await countryRepository.CheckForUniqueness(updatedCountry, cancellationToken);

        if (uniquenessError is not null)
        {
            return ServiceResponse.BadRequestResponse($"Country with this {uniquenessError} already exists");
        }
        
        var result = await countryRepository.UpdateAsync(updatedCountry, cancellationToken);
        
        if (result == null)
        {
            return ServiceResponse.BadRequestResponse("Failed to update country");
        }

        return ServiceResponse.OkResponse("Country updated successfully", mapper.Map<CountryVM>(result));
    }

    public async Task<ServiceResponse> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        try
        {
            var country = await countryRepository.GetByIdAsync(id, cancellationToken);
            if (country == null)
            {
                return ServiceResponse.NotFoundResponse("Country not found");
            }
            await countryRepository.DeleteAsync(id, cancellationToken);
            return ServiceResponse.OkResponse("Country deleted successfully");
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }
}