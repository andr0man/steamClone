using AutoMapper;
using SteamClone.DAL;
using SteamClone.DAL.Repositories.BalanceRepository;
using SteamClone.DAL.Repositories.MarketItemHistoryRepository;
using SteamClone.DAL.Repositories.MarketItemRepository;
using SteamClone.DAL.Repositories.UserItemRepository;
using SteamClone.Domain.Common.Interfaces;
using SteamClone.Domain.Models.Items;
using SteamClone.Domain.ViewModels.Items.MarketItems;

namespace SteamClone.BLL.Services.MarketItemService;

public class MarketItemService(
    IMarketItemRepository marketItemRepository,
    IMapper mapper,
    IUserItemRepository userItemRepository,
    IUserProvider userProvider,
    IBalanceRepository balanceRepository,
    IMarketItemHistoryRepository marketItemHistoryRepository) : IMarketItemService
{
    public async Task<ServiceResponse> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var marketItems = await marketItemRepository.GetAllAsync(cancellationToken);
        return ServiceResponse.OkResponse("Market items retrieved successfully",
            mapper.Map<List<MarketItemVM>>(marketItems));
    }

    public async Task<ServiceResponse> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        var marketItem = await marketItemRepository.GetByIdAsync(id, cancellationToken);

        if (marketItem == null)
        {
            return ServiceResponse.NotFoundResponse("Market item not found");
        }

        return ServiceResponse.OkResponse("Market item retrieved successfully",
            mapper.Map<MarketItemVM>(marketItem));
    }

    public async Task<ServiceResponse> GetHistoryAsync(CancellationToken cancellationToken = default)
    {
        var marketItems = await marketItemHistoryRepository.GetAllAsync(cancellationToken);
        return ServiceResponse.OkResponse("Market items history retrieved successfully",
            mapper.Map<List<MarketItemHistoryVM>>(marketItems));
    }

    public async Task<ServiceResponse> PutUpForSaleAsync(CreateMarketItemVM model,
        CancellationToken cancellationToken = default)
    {
        var userItem = await userItemRepository.GetByIdAsync(model.UserItemId, cancellationToken);

        if (userItem == null)
        {
            return ServiceResponse.NotFoundResponse("User item not found");
        }

        var userId = await userProvider.GetUserId();

        if (userItem.UserId != userId)
        {
            return ServiceResponse.ForbiddenResponse("User item does not belong to current user");
        }

        if (!userItem.IsTradable)
        {
            return ServiceResponse.BadRequestResponse("User item is not tradable");
        }

        if ((await marketItemRepository.IsUserListedItemAsync(userId, model.UserItemId, cancellationToken)))
        {
            return ServiceResponse.BadRequestResponse("User item is already listed for sale");
        }

        try
        {
            var marketItem = mapper.Map<MarketItem>(model);
            marketItem.Id = Guid.NewGuid().ToString();
            await marketItemRepository.CreateAsync(marketItem, cancellationToken);
            return ServiceResponse.OkResponse("Market item created successfully", mapper.Map<MarketItemVM>(marketItem));
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<ServiceResponse> DeleteAsync(string marketItemId, CancellationToken cancellationToken = default)
    {
        var marketItem = await marketItemRepository.GetByIdAsync(marketItemId, cancellationToken);

        if (marketItem == null)
        {
            return ServiceResponse.NotFoundResponse("Market item not found");
        }

        if (marketItem.CreatedBy != (await userProvider.GetUserId()) &&
            userProvider.GetUserRole() != Settings.Roles.AdminRole)
        {
            return ServiceResponse.ForbiddenResponse("You don't have permission to delete this market item");
        }

        try
        {
            await marketItemRepository.DeleteAsync(marketItemId, cancellationToken);
            return ServiceResponse.OkResponse("User item removed from sale successfully");
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<ServiceResponse> BuyAsync(string marketItemId, CancellationToken cancellationToken = default)
    {
        var marketItem = await marketItemRepository.GetByIdAsync(marketItemId, cancellationToken);

        if (marketItem == null)
        {
            return ServiceResponse.NotFoundResponse("Market item not found");
        }
        
        var newOwnerId = await userProvider.GetUserId();
        
        if (marketItem.CreatedBy == newOwnerId)
        {
            return ServiceResponse.BadRequestResponse("You can't buy your own market item");
        }
        
        try
        {
            if (!(await balanceRepository.WithdrawAsync(newOwnerId, marketItem.Price, cancellationToken)))
            {
                return ServiceResponse.BadRequestResponse("Not enough money");
            }
            
            
            var userItem = await userItemRepository.GetByIdAsync(marketItem.UserItemId, cancellationToken);
            await balanceRepository.DepositAsync(userItem!.UserId!, marketItem.Price, cancellationToken);
            userItem.UserId = newOwnerId;
            
            await marketItemHistoryRepository.CreateAsync(new MarketItemHistory()
            {
                Id = Guid.NewGuid().ToString(),
                BuyerId = newOwnerId,
                SellerId = marketItem.CreatedBy,
                Price = marketItem.Price,
                UserItemId = marketItem.UserItemId,
                Date = DateTime.UtcNow
            }, cancellationToken);
            
            await marketItemRepository.DeleteAsync(marketItem.Id, cancellationToken);
            await userItemRepository.UpdateAsync(userItem, cancellationToken);
            return ServiceResponse.OkResponse("Market item bought successfully");
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }
}