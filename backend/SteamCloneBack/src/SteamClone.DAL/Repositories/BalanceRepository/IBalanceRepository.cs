using SteamClone.Domain.Models.Auth.Users;

namespace SteamClone.DAL.Repositories.BalanceRepository;

public interface IBalanceRepository
{
    Task<Balance> CreateAsync(Balance balance, CancellationToken token);
    Task<bool> DepositAsync(string userId, decimal amount, CancellationToken token);
    Task<bool> WithdrawAsync(string userId, decimal amount, CancellationToken token);
    Task<decimal?> GetByUserAsync(string userId, CancellationToken token);
}