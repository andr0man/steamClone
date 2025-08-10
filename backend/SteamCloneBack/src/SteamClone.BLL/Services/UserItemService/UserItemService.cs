using AutoMapper;
using SteamClone.DAL.Repositories.UserItemRepository;
using SteamClone.Domain.Common.Interfaces;
using SteamClone.Domain.ViewModels.Items.UserItem;

namespace SteamClone.BLL.Services.UserItemService;

public class UserItemService(
    IUserItemRepository userItemRepository,
    IMapper mapper,
    IUserProvider userProvider) : IUserItemService
{
    public async Task<ServiceResponse> GetAllAsync(CancellationToken token = default)
    {
        var userItems = await userItemRepository.GetAllAsync(token);

        return ServiceResponse.OkResponse("User items retrieved successfully", mapper.Map<List<UserItemVM>>(userItems));
    }

    public async Task<ServiceResponse> GetByIdAsync(string id, CancellationToken token = default)
    {
        var userItem = await userItemRepository.GetByIdAsync(id, token);

        if (userItem == null)
        {
            return ServiceResponse.NotFoundResponse("User items not found");
        }

        return ServiceResponse.OkResponse("User items retrieved successfully", mapper.Map<UserItemVM>(userItem));
    }

    public async Task<ServiceResponse> GetByUserIdAsync(CancellationToken token = default)
    {
        try
        {
            var userId = await userProvider.GetUserId();
            
            var allUserItems = await userItemRepository.GetAllAsync(token);
            
            var userItems = allUserItems.Where(x => x.UserId == userId).ToList();
            
            return ServiceResponse.OkResponse("User itemsg retrieved successfully", mapper.Map<List<UserItemVM>>(userItems));
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }
}