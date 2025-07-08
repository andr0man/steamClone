using AutoMapper;
using SteamClone.DAL.Repositories.DeveloperRepository;
using SteamClone.Domain.Models.Developers;
using SteamClone.Domain.ViewModels.Developers;

namespace SteamClone.BLL.Services.DeveloperService;

public class DeveloperService(IDeveloperRepository developerRepository, IMapper mapper) : IDeveloperService
{
    public async Task<ServiceResponse> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var developers = await developerRepository.GetAllAsync(cancellationToken);

        return ServiceResponse.OkResponse("Developers retrieved successfully",
            mapper.Map<List<DeveloperVM>>(developers));
    }

    public async Task<ServiceResponse> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        var developer = await developerRepository.GetByIdAsync(id, cancellationToken);

        if (developer == null)
        {
            return ServiceResponse.NotFoundResponse("Developer not found");
        }

        return ServiceResponse.OkResponse("Developer retrieved successfully", mapper.Map<DeveloperVM>(developer));
    }

    public async Task<ServiceResponse> CreateAsync(CreateDeveloperVM model,
        CancellationToken cancellationToken = default)
    {
        var developer = mapper.Map<Developer>(model);

        developer.Id = Guid.NewGuid().ToString();

        try
        {
            var createdDeveloper = await developerRepository.CreateAsync(developer, cancellationToken);
            return ServiceResponse.OkResponse("Developer created successfully", createdDeveloper);
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<ServiceResponse> UpdateAsync(string id, UpdateDeveloperVM model,
        CancellationToken cancellationToken = default)
    {
        var existingDeveloper = await developerRepository.GetByIdAsync(id, cancellationToken);

        if (existingDeveloper == null)
        {
            return ServiceResponse.NotFoundResponse("Developer not found");
        }

        var updatedDeveloper = mapper.Map(model, existingDeveloper);

        try
        {
            var result = await developerRepository.UpdateAsync(updatedDeveloper, cancellationToken);

            return ServiceResponse.OkResponse("Developer updated successfully", result);
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
            var developer = await developerRepository.GetByIdAsync(id, cancellationToken);
            if (developer == null)
            {
                return ServiceResponse.NotFoundResponse("Developer not found");
            }
            await developerRepository.DeleteAsync(id, cancellationToken);
            return ServiceResponse.OkResponse("Developer deleted successfully");
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }
}