using AutoMapper;
using Microsoft.AspNetCore.Http;
using SteamClone.BLL.Services.ImageService;
using SteamClone.DAL;
using SteamClone.DAL.Repositories.GameRepository;
using SteamClone.DAL.Repositories.ItemRepository;
using SteamClone.Domain.Common.Interfaces;
using SteamClone.Domain.Models.Games;
using SteamClone.Domain.Models.Items;
using SteamClone.Domain.ViewModels.Items;

namespace SteamClone.BLL.Services.ItemService;

public class ItemService(
    IItemRepository itemRepository,
    IMapper mapper,
    IGameRepository gameRepository,
    IImageService imageService,
    IHttpContextAccessor httpContextAccessor,
    IUserProvider userProvider) : IItemService
{
    public async Task<ServiceResponse> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var items = await itemRepository.GetAllAsync(cancellationToken);
        return ServiceResponse.OkResponse("Items retrieved successfully", items);
    }

    public async Task<ServiceResponse> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        var item = await itemRepository.GetByIdAsync(id, cancellationToken);
        if (item == null)
        {
            return ServiceResponse.NotFoundResponse("Item not found");
        }

        return ServiceResponse.OkResponse("Item retrieved successfully", item);
    }

    public async Task<ServiceResponse> CreateAsync(CreateItemVM model, CancellationToken cancellationToken = default)
    {
        var item = mapper.Map<Item>(model);

        if (!await itemRepository.IsUniqueNameAsync(model.Name, cancellationToken))
        {
            return ServiceResponse.BadRequestResponse($"Name '{model.Name}' already used");
        }

        var game = await gameRepository.GetByIdAsync(model.GameId, cancellationToken);
        
        if (game == null)
        {
            return ServiceResponse.NotFoundResponse("Game not found");
        }

        if (!await HasAccessToGameAsync(game))
        {
            return ServiceResponse.ForbiddenResponse("You don't have permission to create items for this game");
        }

        try
        {
            item.Id = Guid.NewGuid().ToString();
            
            var createdItem = await itemRepository.CreateAsync(item, cancellationToken);
            return ServiceResponse.OkResponse("Item created successfully", createdItem);
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<ServiceResponse> UpdateAsync(string id, UpdateItemVM model,
        CancellationToken cancellationToken = default)
    {
        var existingItem = await itemRepository.GetByIdAsync(id, cancellationToken, asNoTracking: true);
        if (existingItem == null)
        {
            return ServiceResponse.NotFoundResponse("Item not found");
        }

        if (!await HasAccessToGameAsync(existingItem.GameId, cancellationToken))
        {
            return ServiceResponse.ForbiddenResponse("You don't have permission to update items for this game");
        }

        var updatedItem = mapper.Map(model, existingItem);
        var result = await itemRepository.UpdateAsync(updatedItem, cancellationToken);

        if (result == null)
        {
            return ServiceResponse.BadRequestResponse("Failed to update item");
        }

        return ServiceResponse.OkResponse("Item updated successfully", result);
    }

    public async Task<ServiceResponse> DeleteAsync(string id, CancellationToken cancellationToken = default)
    {
        try
        {
            var item = await itemRepository.GetByIdAsync(id, cancellationToken);
            if (item == null)
            {
                return ServiceResponse.NotFoundResponse("Item not found");
            }

            if (!await HasAccessToGameAsync(item.GameId, cancellationToken))
            {
                return ServiceResponse.ForbiddenResponse("You don't have permission to delete items for this game");
            }

            await itemRepository.DeleteAsync(id, cancellationToken);
            return ServiceResponse.OkResponse("Item deleted successfully");
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public async Task<ServiceResponse> UpdateImageAsync(string id, IFormFile image, CancellationToken cancellationToken = default)
    {
        var item = await itemRepository.GetByIdAsync(id, cancellationToken);
        
        if (item == null)
        {
            return ServiceResponse.NotFoundResponse("Item not found");
        }

        if (!await HasAccessToGameAsync(item.GameId, cancellationToken))
        {
            return ServiceResponse.ForbiddenResponse("You don't have permission to update images for this item");
        }
        
        var imageName = item.ImageUrl?.Split('/').LastOrDefault();

        var newImageName =
            await imageService.SaveImageFromFileAsync(Settings.ImagesPathSettings.ItemImagePath, image, imageName);

        if (newImageName == null)
        {
            return ServiceResponse.BadRequestResponse("No image uploaded");
        }
        
        var baseUrl = $"{httpContextAccessor.HttpContext!.Request.Scheme}://{httpContextAccessor.HttpContext.Request.Host}/";
        
        item.ImageUrl = $"{baseUrl}{Settings.ImagesPathSettings.ItemImagePathForUrl}/{newImageName}";

        try
        {
            var result = await itemRepository.UpdateAsync(item, cancellationToken);
            return ServiceResponse.OkResponse("Image updated successfully", result);
        }
        catch (Exception e)
        {
            return ServiceResponse.BadRequestResponse(e.Message);
        }
    }
    
    private async Task<bool> HasAccessToGameAsync(Game game)
    {
        var userRole = userProvider.GetUserRole();
        var userId = await userProvider.GetUserId();
        return game.AssociatedUsers.Any(x => x.Id == userId) || userRole == Settings.Roles.AdminRole;
    }
    
    private async Task<bool> HasAccessToGameAsync(string gameId, CancellationToken token)
    {
        var game = await gameRepository.GetByIdAsync(gameId, token);
        var userRole = userProvider.GetUserRole();
        var userId = await userProvider.GetUserId();
        return game!.AssociatedUsers.Any(x => x.Id == userId) || userRole == Settings.Roles.AdminRole;
    }
}