using System.Linq.Expressions;
using SteamClone.Domain.Models;
using SteamClone.Domain.Models.Auth;

namespace SteamClone.DAL.Repositories.RoleRepository
{
    public interface IRoleRepository
    {
        Task<IReadOnlyList<Role?>?> GetAllAsync();
        Task<Role?> GetByNameAsync(string name);
        
    }
}