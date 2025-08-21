using SteamClone.DAL;
using SteamClone.Domain.Models.Auth;
using SteamClone.Domain.Models.Auth.Users;

namespace Tests.Data;

public class UserData
{
    public static User UserForAuth(string userId, int countryId) => new()
    {
        Id = userId,
        Email = "qwerty@gmail.com",
        PasswordHash = "fdsafdsafsad",
        RoleId = Settings.Roles.AdminRole,
        Nickname = "qwerty",
        CountryId = countryId
    };
}