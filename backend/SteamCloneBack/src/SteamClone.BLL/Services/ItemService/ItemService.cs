using AutoMapper;
using Microsoft.AspNetCore.Http;
using SteamClone.BLL.Services.ImageService;
using SteamClone.DAL;
using SteamClone.DAL.Repositories.GameRepository;
using SteamClone.DAL.Repositories.ItemRepository;
using SteamClone.Domain.Models.Items;
using SteamClone.Domain.ViewModels.Items;

namespace SteamClone.BLL.Services.ItemService;

public class ItemService(
    IItemRepository itemRepository,
    IMapper mapper,
    IGameRepository gameRepository,
    IImageService imageService,
    IHttpContextAccessor httpContextAccessor) : IItemService
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
        
        if (await gameRepository.GetByIdAsync(model.GameId, cancellationToken) == null)
        {
            return ServiceResponse.NotFoundResponse("Game not found");
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
}