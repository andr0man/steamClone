using AutoMapper;
using Microsoft.AspNetCore.Http;
using SteamClone.BLL.Services.ImageService;
using SteamClone.BLL.Services.PasswordHasher;
using SteamClone.DAL;
using SteamClone.DAL.Repositories.UserRepository;
using SteamClone.Domain.Models;
using SteamClone.Domain.Models.Auth;
using SteamClone.Domain.ViewModels.Users;

namespace SteamClone.BLL.Services.UserService;

public class UserService(
    IUserRepository userRepository,
    IImageService imageService,
    IHttpContextAccessor httpContextAccessor,
    IMapper mapper,
    IPasswordHasher passwordHasher) : IUserService
{
    public async Task<ServiceResponse> GetByIdAsync(string id, CancellationToken token = default)
    {
        var user = await userRepository.GetByIdAsync(id, token, includes: true);
        if (user == null)
        {
            return ServiceResponse.NotFoundResponse("User not found");
        }

        var userVm = mapper.Map<UserVM>(user);
        return ServiceResponse.OkResponse("User by id", userVm);
    }

    public async Task<ServiceResponse> GetByEmailAsync(string email, CancellationToken token = default)
    {
        var user = await userRepository.GetByEmailAsync(email, token, includes: true);
        if (user == null)
        {
            return ServiceResponse.NotFoundResponse("User not found");
        }

        var userVm = mapper.Map<UserVM>(user);
        return ServiceResponse.OkResponse("User by email", userVm);
    }

    public async Task<ServiceResponse> GetByUserNicknameAsync(string userName, CancellationToken token = default)
    {
        var user = await userRepository.GetByUserNicknameAsync(userName, token, includes: true);
        if (user == null)
        {
            return ServiceResponse.NotFoundResponse("User not found");
        }

        var userVm = mapper.Map<UserVM>(user);
        return ServiceResponse.OkResponse("User by nickname",userVm);
    }

    public async Task<ServiceResponse> GetAllAsync(CancellationToken token = default)
    {
        var users = await userRepository.GetAllAsync(token);
        var userVms = mapper.Map<List<UserVM>>(users);
        return ServiceResponse.OkResponse("All users",userVms);
    }

    public async Task<ServiceResponse> GetAllAsync(int page, int pageSize, CancellationToken token = default)
    {
        var (users, totalCount) = await userRepository.GetPagedAsync(page, pageSize, token);

        var userVms = mapper.Map<List<UserVM>>(users);
        var result = new UserListVM
        {
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount,
            PageCount = (int)Math.Ceiling((double)totalCount / pageSize),
            Users = userVms
        };
        return ServiceResponse.OkResponse("Paged users", result);
    }

    public async Task<ServiceResponse> DeleteAsync(string id, CancellationToken token = default)
    {
        var user = await userRepository.GetByIdAsync(id, token);
        if (user == null)
        {
            return ServiceResponse.NotFoundResponse("User not found");
        }

        await userRepository.DeleteAsync(id, token);
        return ServiceResponse.OkResponse("User deleted successfully");
    }

    public async Task<ServiceResponse> CreateAsync(CreateUserVM model, CancellationToken token)
    {
        if (!await userRepository.IsUniqueNicknameAsync(model.Nickname, token))
        {
            return ServiceResponse.BadRequestResponse($"{model.Nickname} already used");
        }

        if (!await userRepository.IsUniqueEmailAsync(model.Email, token))
        {
            return ServiceResponse.BadRequestResponse($"{model.Email} already used");
        }

        var user = mapper.Map<User>(model);
        user.Id = Guid.NewGuid().ToString();
        user.PasswordHash = passwordHasher.HashPassword(model.Password);

        await userRepository.CreateAsync(user, token);

        return ServiceResponse.OkResponse("Користувач успішно створений", mapper.Map<UserVM>(user));
    }

    public async Task<ServiceResponse> UpdateAsync(UpdateUserVM model, CancellationToken token = default)
    {
        var user = await userRepository.GetByIdAsync(model.Id!, token);
        if (user == null)
        {
            return ServiceResponse.NotFoundResponse("User not found");
        }

        mapper.Map(model, user);
        await userRepository.UpdateAsync(user, token);

        var updatedUser = await userRepository.GetByIdAsync(model.Id!, token, includes: true);
        var userVm = mapper.Map<UserVM>(updatedUser);

        return ServiceResponse.OkResponse("User updated successfully", userVm);
    }

    public async Task<ServiceResponse> AddImageFromUserAsync(UserImageVM model, CancellationToken token = default)
    {
        var user = await userRepository.GetByIdAsync(model.UserId, token);
        if (user == null)
            return ServiceResponse.NotFoundResponse("User not found");

        string? oldImageName = user.AvatarUrl?.Split('/').LastOrDefault();

        var newImageName = await imageService.SaveImageFromFileAsync(
            Settings.ImagesPathSettings.UserAvatarImagePath,
            model.Image,
            oldImageName
        );

        if (string.IsNullOrEmpty(newImageName))
            return ServiceResponse.BadRequestResponse("No image uploaded");

        var baseUrl = $"{httpContextAccessor.HttpContext!.Request.Scheme}://{httpContextAccessor.HttpContext.Request.Host}/";
        var newImageUrl = $"{baseUrl}{Settings.ImagesPathSettings.UserAvatarImagePathForUrl}/{newImageName}";

        user.AvatarUrl = newImageUrl;
        await userRepository.UpdateAsync(user, token);

        return ServiceResponse.OkResponse("User avatar updated successfully", newImageUrl);
    }

    public async Task<ServiceResponse> GetUsersByRoleAsync(string role, CancellationToken token = default)
    {
        var users = await userRepository.GetUsersByRoleAsync(role, token);

        if (users == null || !users.Any())
        {
            return ServiceResponse.NotFoundResponse("No users with this role found");
        }

        var userVms = mapper.Map<List<UserVM>>(users);
        return ServiceResponse.OkResponse("Users by role", userVms);
    }
}