using SteamClone.DAL;
using SteamClone.Domain.Models.Auth;

namespace Tests.Data;

public class UserData
{
    public static User UserForAuth(string userId, int countryId) => new()
    {
        Id = userId,
        Email = "qwerty@gmail.com",
        PasswordHash = "fdsafdsafsad",
        RoleId = Settings.AdminRole,
        Nickname = "qwerty",
        CountryId = countryId
    };
}