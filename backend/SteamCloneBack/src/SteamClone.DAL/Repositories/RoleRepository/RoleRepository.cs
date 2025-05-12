using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using SteamClone.DAL.Data;
using SteamClone.DAL.Models;

namespace SteamClone.DAL.Repositories.RoleRepository;

public class RoleRepository(AppDbContext appDbContext) : IRoleRepository
{

    public async Task<IReadOnlyList<Role>> GetAllAsync()
    {
        return await appDbContext.Roles.ToListAsync();
    }

    public async Task<Role?> GetAsync(Expression<Func<Role, bool>> predicate)
    {
        var role = await appDbContext.Roles.FirstOrDefaultAsync(predicate);
        return role;
    }

    public async Task<Role?> GetByNameAsync(string name)
    {
        return await GetAsync(r => r.Name.ToUpper() == name.ToUpper());
    }
}