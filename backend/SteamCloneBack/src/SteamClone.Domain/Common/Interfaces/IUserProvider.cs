namespace SteamClone.Domain.Common.Interfaces;

public interface IUserProvider
{
    Task<string> GetUserId();
    string GetUserRole();
}