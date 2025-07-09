using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace SteamClone.BLL.Services.ImageService;

public class ImageService(IWebHostEnvironment webHostEnvironment) : IImageService
{
    public async Task<string?> SaveImageFromFileAsync(string path, IFormFile image, string? oldImagePath = null)
    {
        try
        {
            if (!string.IsNullOrEmpty(oldImagePath))
            {
                var fullOldPath = Path.Combine(webHostEnvironment.ContentRootPath, path, oldImagePath);
                if (File.Exists(fullOldPath))
                {
                    File.Delete(fullOldPath);
                }
                else
                {
                    throw new Exception("File path does not exist to save image.");
                }
            }

            var types = image.ContentType.Split('/');

            if (types[0] != "image")
            {
                return null;
            }

            var root = webHostEnvironment.ContentRootPath;
            var imageName = $"{Guid.NewGuid()}.{types[1]}";
            var filePath = Path.Combine(root, path, imageName);

            using (var stream = File.OpenWrite(filePath))
            {
                using (var imageStream = image.OpenReadStream())
                {
                    await imageStream.CopyToAsync(stream);
                }
            }

            return imageName;
        }
        catch (Exception ex)
        {
            throw new Exception(message: ex.Message);
        }
    }

    public async Task<List<string?>> SaveImagesFromFilesAsync(
        string path,
        IFormFileCollection images)
    {
        try
        {
            var savedImageNames = new List<string>();

            foreach (var image in images)
            {
                var imageName = await SaveImageFromFileAsync(path, image);

                savedImageNames.Add(imageName!);
            }

            return savedImageNames!;
        }
        catch (Exception ex)
        {
            throw new Exception(message: ex.Message);
        }
    }

    public bool DeleteImage(string path, string imageName)
    {
        try
        {
            var fullOldPath = Path.Combine(webHostEnvironment.ContentRootPath, path, imageName);
            if (File.Exists(fullOldPath))
            {
                File.Delete(fullOldPath);
            }
            else
            {
                throw new Exception($"File {fullOldPath} does not exist to delete image.");
            }

            return true;
        }
        catch (Exception e)
        {
            return false;
        }
    }
}