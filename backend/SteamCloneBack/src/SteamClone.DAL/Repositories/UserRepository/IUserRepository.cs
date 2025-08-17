using SteamClone.DAL.Repositories.Common;
using SteamClone.Domain.Models;
using SteamClone.Domain.Models.Auth;
using SteamClone.Domain.Models.Auth.Users;

namespace SteamClone.DAL.Repositories.UserRepository
{
    public interface IUserRepository : IRepository<User, string>
    {
        Task<User?> GetByEmailAsync(string email, CancellationToken token, bool includes = false);
        new Task<User?> GetByIdAsync(string id, CancellationToken token, bool includes = false);
        Task<(List<User> Users, int TotalCount)> GetPagedAsync(int page, int pageSize, CancellationToken token = default);
        Task<User?> GetByUserNicknameAsync(string nickName, CancellationToken token, bool includes = false);
        Task<bool> IsUniqueEmailAsync(string email, CancellationToken token);
        Task<bool> IsUniqueNicknameAsync(string nickName, CancellationToken token);
        Task<List<User>> GetUsersByRoleAsync(string roleName, CancellationToken token = default);
    }
}
