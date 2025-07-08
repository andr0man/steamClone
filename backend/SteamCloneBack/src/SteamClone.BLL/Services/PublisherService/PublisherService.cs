using AutoMapper;
using SteamClone.DAL.Repositories.PublisherRepository;
using SteamClone.Domain.Models.Publishers;
using SteamClone.Domain.ViewModels.Publishers;

namespace SteamClone.BLL.Services.PublisherService;

public class PublisherService(IPublisherRepository publisherRepository, IMapper mapper) : IPublisherService
{
    public async Task<ServiceResponse> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var publishers = await publisherRepository.GetAllAsync(cancellationToken);

        return ServiceResponse.OkResponse("Publishers retrieved successfully",
            mapper.Map<List<PublisherVM>>(publishers));
    }

    public async Task<ServiceResponse> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        var publisher = await publisherRepository.GetByIdAsync(id, cancellationToken);

        if (publisher == null)
        {
            return ServiceResponse.NotFoundResponse("Publisher not found");
        }

        return ServiceResponse.OkResponse("Publisher retrieved successfully", mapper.Map<PublisherVM>(publisher));
    }

    public async Task<ServiceResponse> CreateAsync(CreatePublisherVM model,
        CancellationToken cancellationToken = default)
    {
        var publisher = mapper.Map<Publisher>(model);

        publisher.Id = Guid.NewGuid().ToString();

        try
        {
            var createdPublisher = await publisherRepository.CreateAsync(publisher, cancellationToken);
            return ServiceResponse.OkResponse("Publisher created successfully", createdPublisher);
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<ServiceResponse> UpdateAsync(string id, UpdatePublisherVM model,
        CancellationToken cancellationToken = default)
    {
        var existingPublisher = await publisherRepository.GetByIdAsync(id, cancellationToken);

        if (existingPublisher == null)
        {
            return ServiceResponse.NotFoundResponse("Publisher not found");
        }

        var updatedPublisher = mapper.Map(model, existingPublisher);

        try
        {
            var result = await publisherRepository.UpdateAsync(updatedPublisher, cancellationToken);

            return ServiceResponse.OkResponse("Publisher updated successfully", result);
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
            var publisher = await publisherRepository.GetByIdAsync(id, cancellationToken);
            if (publisher == null)
            {
                return ServiceResponse.NotFoundResponse("Publisher not found");
            }
            await publisherRepository.DeleteAsync(id, cancellationToken);
            return ServiceResponse.OkResponse("Publisher deleted successfully");
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }
}