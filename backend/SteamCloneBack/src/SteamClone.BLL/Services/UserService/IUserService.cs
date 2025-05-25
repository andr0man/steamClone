using SteamClone.DAL.ViewModels;
using SteamClone.DAL.ViewModels.Users;

namespace SteamClone.BLL.Services.UserService;

public interface IUserService
{
    Task<ServiceResponse> GetByIdAsync(string id, CancellationToken token = default);
    Task<ServiceResponse> GetByEmailAsync(string email, CancellationToken token = default);
    Task<ServiceResponse> GetByUserNicknameAsync(string userName, CancellationToken token = default);
    Task<ServiceResponse> GetAllAsync(CancellationToken token = default);
    Task<ServiceResponse> GetAllAsync(int page, int pageSize, CancellationToken token = default);
    Task<ServiceResponse> DeleteAsync(string id, CancellationToken token = default);
    Task<ServiceResponse> CreateAsync(CreateUserVM model, CancellationToken token = default);
    Task<ServiceResponse> UpdateAsync(UpdateUserVM model, CancellationToken token = default);
    Task<ServiceResponse> AddImageFromUserAsync(UserImageVM model, CancellationToken token = default);
    Task<ServiceResponse> GetUsersByRoleAsync(string role, CancellationToken token = default);
}