using AutoMapper;
using SteamClone.DAL.Repositories.DeveloperAndPublisherRepository;
using SteamClone.Domain.Models.DevelopersAndPublishers;
using SteamClone.Domain.ViewModels.DevelopersAndPublishers;

namespace SteamClone.BLL.Services.DeveloperAndPublisherService;

public class DeveloperAndPublisherService(IDeveloperAndPublisherRepository developerAndPublisherRepository, IMapper mapper) : IDeveloperAndPublisherService
{
    public async Task<ServiceResponse> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var developers = await developerAndPublisherRepository.GetAllAsync(cancellationToken);

        return ServiceResponse.OkResponse("Developers Or Publishers retrieved successfully",
            mapper.Map<List<DeveloperAndPublisherVM>>(developers));
    }

    public async Task<ServiceResponse> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        var developerAndPublisher = await developerAndPublisherRepository.GetByIdAsync(id, cancellationToken);

        if (developerAndPublisher == null)
        {
            return ServiceResponse.NotFoundResponse("Developer Or Publisher not found");
        }

        return ServiceResponse.OkResponse("Developer Or Publisher retrieved successfully", mapper.Map<DeveloperAndPublisherVM>(developerAndPublisher));
    }

    public async Task<ServiceResponse> CreateAsync(CreateDeveloperAndPublisherVM model,
        CancellationToken cancellationToken = default)
    {
        var developerAndPublisher = mapper.Map<DeveloperAndPublisher>(model);

        developerAndPublisher.Id = Guid.NewGuid().ToString();

        try
        {
            var createdDeveloper = await developerAndPublisherRepository.CreateAsync(developerAndPublisher, cancellationToken);
            return ServiceResponse.OkResponse("Developer Or Publisher created successfully", createdDeveloper);
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<ServiceResponse> UpdateAsync(string id, UpdateDeveloperAndPublisherVM model,
        CancellationToken cancellationToken = default)
    {
        var existingDeveloper = await developerAndPublisherRepository.GetByIdAsync(id, cancellationToken);

        if (existingDeveloper == null)
        {
            return ServiceResponse.NotFoundResponse("Developer Or Publisher not found");
        }

        var updatedDeveloper = mapper.Map(model, existingDeveloper);

        try
        {
            var result = await developerAndPublisherRepository.UpdateAsync(updatedDeveloper, cancellationToken);

            return ServiceResponse.OkResponse("Developer Or Publisher updated successfully", result);
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
            var developerAndPublisher = await developerAndPublisherRepository.GetByIdAsync(id, cancellationToken);
            if (developerAndPublisher == null)
            {
                return ServiceResponse.NotFoundResponse("Developer Or Publisher not found");
            }
            await developerAndPublisherRepository.DeleteAsync(id, cancellationToken);
            return ServiceResponse.OkResponse("Developer Or Publisher deleted successfully");
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }
}