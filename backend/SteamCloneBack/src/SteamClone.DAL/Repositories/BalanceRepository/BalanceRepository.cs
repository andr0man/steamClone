using Microsoft.EntityFrameworkCore;
using SteamClone.DAL.Data;
using SteamClone.Domain.Models.Auth.Users;

namespace SteamClone.DAL.Repositories.BalanceRepository;

public class BalanceRepository(AppDbContext appDbContext) : IBalanceRepository
{
    public async Task<Balance> CreateAsync(Balance balance, CancellationToken token)
    {
        var entity = await appDbContext.Balances.AddAsync(balance, token);
        
        await appDbContext.SaveChangesAsync(token);
        
        return entity.Entity;
    }

    public async Task<bool> DepositAsync(string userId, decimal amount, CancellationToken token)
    {
        var balance = await appDbContext.Balances.FirstOrDefaultAsync(b => b.UserId == userId, token);
        
        balance!.Amount += amount;
        
        await appDbContext.SaveChangesAsync(token);
        
        return true;
    }

    public async Task<bool> WithdrawAsync(string userId, decimal amount, CancellationToken token)
    {
        var balance = await appDbContext.Balances.FirstOrDefaultAsync(b => b.UserId == userId, token);
        
        if (balance!.Amount < amount)
        {
            return false;
        }
        
        balance.Amount -= amount;
        
        await appDbContext.SaveChangesAsync(token);
        
        return true;
    }
}