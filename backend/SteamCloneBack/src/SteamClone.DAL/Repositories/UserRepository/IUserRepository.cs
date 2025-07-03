using SteamClone.DAL.Repositories.Common;
using SteamClone.Domain.Models;
using SteamClone.Domain.Models.Auth;

namespace SteamClone.DAL.Repositories.UserRepository
{
    public interface IUserRepository : IRepository<User, string>
    {
        Task<User?> GetByEmailAsync(string email, CancellationToken token, bool includes = false);
        new Task<User?> GetByIdAsync(string id, CancellationToken token, bool includes = false);
        Task<User?> GetByUserNicknameAsync(string nickName, CancellationToken token, bool includes = false);
        Task<bool> IsUniqueEmailAsync(string email, CancellationToken token);
        Task<bool> IsUniqueNicknameAsync(string nickName, CancellationToken token);
    }
}
