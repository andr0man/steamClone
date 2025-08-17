using AutoMapper;
using SteamClone.DAL;
using SteamClone.DAL.Repositories.GameRepository;
using SteamClone.DAL.Repositories.ItemRepository;
using SteamClone.DAL.Repositories.UserItemRepository;
using SteamClone.Domain.Common.Interfaces;
using SteamClone.Domain.Models.Games;
using SteamClone.Domain.Models.Items;
using SteamClone.Domain.ViewModels.Items.UserItem;

namespace SteamClone.BLL.Services.UserItemService;

public class UserItemService(
    IUserItemRepository userItemRepository,
    IMapper mapper,
    IUserProvider userProvider,
    IGameRepository gameRepository,
    IItemRepository itemRepository) : IUserItemService
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

    public async Task<ServiceResponse> CreateAsync(CreateUserItemVM model, CancellationToken token = default)
    {
        var item = await itemRepository.GetByIdAsync(model.ItemId, token);
        
        if (item == null)
        {
            return ServiceResponse.NotFoundResponse("Item not found");
        }
        
        var game = await gameRepository.GetByIdAsync(item.GameId, token);
        
        if (game == null)
        {
            return ServiceResponse.NotFoundResponse("Game not found");
        }
        
        if (!await HasAccessToGameAsync(game))
        {
            return ServiceResponse.ForbiddenResponse("You don't have permission to create user items for this game");
        }
        
        var userItem = mapper.Map<UserItem>(model);
        userItem.Id = Guid.NewGuid().ToString();
        
        try
        {
            await userItemRepository.CreateAsync(userItem, token);
            return ServiceResponse.OkResponse("User item created successfully", mapper.Map<UserItemVM>(userItem));
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }
    
    private async Task<bool> HasAccessToGameAsync(Game game)
    {
        var userRole = userProvider.GetUserRole();
        var userId = await userProvider.GetUserId();
        return game.AssociatedUsers.Any(x => x.Id == userId) || userRole == Settings.AdminRole;
    }
}