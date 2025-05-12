using SteamClone.DAL.Models;
using SteamClone.DAL.Repositories.Common;

namespace SteamClone.DAL.Repositories.UserRepository
{
    public interface IUserRepository : IRepository<User, string>
    {
        Task<User?> GetByEmailAsync(string email, bool includes = false);
        Task<User?> GetByIdAsync(string id, bool includes = false);
        Task<User?> GetByUsernameAsync(string nickName, bool includes = false);
        Task<bool> IsUniqueEmailAsync(string email);
        Task<bool> IsUniqueUserNameAsync(string nickName);
    }
}
