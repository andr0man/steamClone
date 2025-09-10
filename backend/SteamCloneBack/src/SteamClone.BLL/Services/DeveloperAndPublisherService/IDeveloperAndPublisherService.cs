using SteamClone.BLL.Services.Common;
using SteamClone.Domain.ViewModels.DevelopersAndPublishers;

namespace SteamClone.BLL.Services.DeveloperAndPublisherService;

public interface IDeveloperAndPublisherService : IServiceCRUD<string, CreateDeveloperAndPublisherVM, UpdateDeveloperAndPublisherVM>
{
    Task<ServiceResponse> AssociateUserAsync(string developerAndPublisherId, string userId, CancellationToken token);
    Task<ServiceResponse> RemoveAssociatedUserAsync(string developerAndPublisherId, string userId, CancellationToken token);
    Task<ServiceResponse> GetByAssociatedUserAsync(CancellationToken token);
    Task<ServiceResponse> ApproveAsync(string id, bool isApproved, CancellationToken token);
    Task<ServiceResponse> GetWithoutApprovalAsync(CancellationToken token);
    Task<ServiceResponse> GetAssociatedUsersAsync(string devAndPubId, CancellationToken token);
    Task<ServiceResponse> IsDevOrPubOwnerAsync(string devAndPubId, CancellationToken token);
}