using Microsoft.AspNetCore.Http;

namespace SteamClone.BLL.Services.ImageService
{
    public interface IImageService
    {
        Task<string?> SaveImageFromFileAsync(string path, IFormFile image, string? oldImagePath = null);
        Task<List<string?>> SaveImagesFromFilesAsync(string path, IFormFileCollection images);
        bool DeleteImage(string path, string imageName);
    }
}