using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace SteamClone.BLL.Services.ImageService
{
    public class ImageService : IImageService
    {
        private readonly IWebHostEnvironment _webHostEnvironment;

        public ImageService(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
        }

        public async Task<ServiceResponse> SaveImageFromBase64Async(string path, string base64)
        {
            var parts = base64.Split(',');
            var validBase64 = parts[1];
            var types = parts[0].Split(';')[0].Split(':')[1].Split('/');

            if(types[0] != "image")
            {
                return ServiceResponse.BadRequestResponse("Файл не є картинкою");
            }

            var root = _webHostEnvironment.ContentRootPath;
            var imageName = $"{Guid.NewGuid()}.{types[1]}";
            var filePath = Path.Combine(root, path, imageName);

            var bytes = Convert.FromBase64String(validBase64);
            await File.WriteAllBytesAsync(filePath, bytes);

            return ServiceResponse.OkResponse("Зображення успішно збережено", imageName);
        }

        public async Task<ServiceResponse> SaveImageFromFileAsync(string path, IFormFile image)
        {
            var types = image.ContentType.Split('/');

            if (types[0] != "image")
            {
                return ServiceResponse.BadRequestResponse("Файл не є картинкою");
            }

            var root = _webHostEnvironment.ContentRootPath;
            var imageName = $"{Guid.NewGuid()}.{types[1]}";
            var filePath = Path.Combine(root, path, imageName);

            using(var stream = File.OpenWrite(filePath))
            {
                using(var imageStream = image.OpenReadStream())
                {
                    await imageStream.CopyToAsync(stream);
                }
            }

            return ServiceResponse.OkResponse("Зображення успішно збережено", imageName);
        }
    }
}
