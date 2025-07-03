using System.Linq.Expressions;
using Microsoft.AspNetCore.Identity;
using SteamClone.Domain.Models;

namespace SteamClone.DAL.Repositories.RoleRepository
{
    public interface IRoleRepository
    {
        Task<IReadOnlyList<Role?>?> GetAllAsync();
        Task<Role?> GetByNameAsync(string name);
        
    }
}