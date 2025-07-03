namespace SteamClone.Domain.Models.Common.Interfaces;

public interface IUserProvider
{
    Task<string> GetUserId();
}