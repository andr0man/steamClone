namespace SteamClone.BLL.Services.PasswordHasher;

public interface IPasswordHasher
{
    string HashPassword(string password);
    bool Verify(string password, string passwordHash);
}