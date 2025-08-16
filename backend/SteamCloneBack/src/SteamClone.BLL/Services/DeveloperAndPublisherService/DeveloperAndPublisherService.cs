using AutoMapper;
using SteamClone.DAL;
using SteamClone.DAL.Repositories.CountryRepository;
using SteamClone.DAL.Repositories.DeveloperAndPublisherRepository;
using SteamClone.DAL.Repositories.UserRepository;
using SteamClone.Domain.Common.Interfaces;
using SteamClone.Domain.Models.DevelopersAndPublishers;
using SteamClone.Domain.ViewModels.DevelopersAndPublishers;

namespace SteamClone.BLL.Services.DeveloperAndPublisherService;

public class DeveloperAndPublisherService(
    IDeveloperAndPublisherRepository developerAndPublisherRepository,
    IMapper mapper,
    ICountryRepository countryRepository,
    IUserRepository userRepository,
    IUserProvider userProvider) : IDeveloperAndPublisherService
{
    public async Task<ServiceResponse> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var developers = (await developerAndPublisherRepository.GetAllAsync(cancellationToken))
            .Where(x => x.IsApproved.HasValue && x.IsApproved.Value);

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

        return ServiceResponse.OkResponse("Developer Or Publisher retrieved successfully",
            mapper.Map<DeveloperAndPublisherVM>(developerAndPublisher));
    }

    public async Task<ServiceResponse> CreateAsync(CreateDeveloperAndPublisherVM model,
        CancellationToken cancellationToken = default)
    {
        var developerAndPublisher = mapper.Map<DeveloperAndPublisher>(model);

        developerAndPublisher.Id = Guid.NewGuid().ToString();

        if (await countryRepository.GetByIdAsync(model.CountryId, cancellationToken) == null)
        {
            return ServiceResponse.NotFoundResponse($"Country with id '{model.CountryId}' not found");
        }

        if (!await developerAndPublisherRepository.IsUniqueNameAsync(model.Name, cancellationToken))
        {
            return ServiceResponse.BadRequestResponse(
                $"Developer Or Publisher with name '{model.Name}' already exists");
        }
        
        var userRole = userProvider.GetUserRole();
        
        if (userRole == "Admin")
        {
            developerAndPublisher.IsApproved = true;
        }
        
        var user = await userRepository.GetByIdAsync(await userProvider.GetUserId(), cancellationToken);
        developerAndPublisher.AssociatedUsers.Add(user!);

        try
        {
            var createdDeveloper =
                await developerAndPublisherRepository.CreateAsync(developerAndPublisher, cancellationToken);
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

        if (await countryRepository.GetByIdAsync(model.CountryId, cancellationToken) == null)
        {
            return ServiceResponse.NotFoundResponse($"Country with id '{model.CountryId}' not found");
        }

        if (!await developerAndPublisherRepository.IsUniqueNameAsync(model.Name, cancellationToken))
        {
            return ServiceResponse.BadRequestResponse(
                $"Developer Or Publisher with name '{model.Name}' already exists");
        }
        
        var userRole = userProvider.GetUserRole();
        var userId = await userProvider.GetUserId();

        if (!(existingDeveloper.AssociatedUsers.Any(x => x.Id == userId)) && userRole != Settings.AdminRole)
        {
            return ServiceResponse.ForbiddenResponse("You don't have permission to update this developer or publisher");
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

    public async Task<ServiceResponse> AssociateUserAsync(string developerAndPublisherId, string userId,
        CancellationToken token)
    {
        var user = await userRepository.GetByIdAsync(userId, token);

        if (user == null)
        {
            return ServiceResponse.NotFoundResponse("User not found");
        }

        var developerAndPublisher = await developerAndPublisherRepository.GetByIdAsync(developerAndPublisherId, token);

        if (developerAndPublisher == null)
        {
            return ServiceResponse.NotFoundResponse("Developer Or Publisher not found");
        }
        
        var userRole = userProvider.GetUserRole();
        
        if (!(developerAndPublisher.AssociatedUsers.Any(x => x.Id == userId)) && userRole != Settings.AdminRole)
        {
            return ServiceResponse.ForbiddenResponse("You don't have permission to associate users");
        }

        developerAndPublisher.AssociatedUsers.Add(user);

        try
        {
            await developerAndPublisherRepository.UpdateAsync(developerAndPublisher, token);
            return ServiceResponse.OkResponse("User associated successfully");
        }
        catch (Exception e)
        {
            return ServiceResponse.BadRequestResponse(e.Message);
        }
    }

    public async Task<ServiceResponse> RemoveAssociatedUserAsync(string developerAndPublisherId, string userId, CancellationToken token)
    {
        var user = await userRepository.GetByIdAsync(userId, token);

        if (user == null)
        {
            return ServiceResponse.NotFoundResponse("User not found");
        }

        var developerAndPublisher = await developerAndPublisherRepository.GetByIdAsync(developerAndPublisherId, token);

        if (developerAndPublisher == null)
        {
            return ServiceResponse.NotFoundResponse("Developer Or Publisher not found");
        }
        
        var userRole = userProvider.GetUserRole();
        
        if (!(developerAndPublisher.AssociatedUsers.Any(x => x.Id == userId)) && userRole != Settings.AdminRole)
        {
            return ServiceResponse.ForbiddenResponse("You don't have permission to remove associated users");
        }

        developerAndPublisher.AssociatedUsers.Remove(user);

        try
        {
            await developerAndPublisherRepository.UpdateAsync(developerAndPublisher, token);
            return ServiceResponse.OkResponse("User association removed successfully");
        }
        catch (Exception e)
        {
            return ServiceResponse.BadRequestResponse(e.Message);
        }
    }

    public async Task<ServiceResponse> GetByAssociatedUserAsync(CancellationToken token)
    {
        var userId = await userProvider.GetUserId();
        
        return await GetByAssociatedUserIdAsync(userId, token);
    }

    public async Task<ServiceResponse> GetByAssociatedUserIdAsync(string id, CancellationToken token)
    {
        var developers = await developerAndPublisherRepository.GetAllAsync(token);
        var developersByAssociatedUser = developers
            .Where(d => d.AssociatedUsers.Any(u => u.Id == id) && (d.IsApproved.HasValue && d.IsApproved.Value));

        return ServiceResponse.OkResponse("Developers Or Publishers by associated user retrieved successfully",
            mapper.Map<List<DeveloperAndPublisherVM>>(developersByAssociatedUser));
    }

    public async Task<ServiceResponse> ApproveAsync(string id, bool isUserApproved, CancellationToken token)
    {
        var developerAndPublisher = await developerAndPublisherRepository.GetByIdAsync(id, token);

        if (developerAndPublisher == null)
        {
            return ServiceResponse.NotFoundResponse("Developer Or Publisher not found");
        }
        
        developerAndPublisher.IsApproved = isUserApproved;

        try
        {
            await developerAndPublisherRepository.UpdateAsync(developerAndPublisher, token);
            return ServiceResponse.OkResponse("Developer Or Publisher approval set successfully");
        }
        catch (Exception e)
        {
            return ServiceResponse.BadRequestResponse(e.Message);
        }
    }

    public async Task<ServiceResponse> GetWithoutApprovalAsync(CancellationToken token)
    {
        var developers = (await developerAndPublisherRepository.GetAllAsync(token))
            .Where(x => x.IsApproved.HasValue == false);

        return ServiceResponse.OkResponse("Developers Or Publishers without approval retrieved successfully",
            mapper.Map<List<DeveloperAndPublisherVM>>(developers));
    }
}