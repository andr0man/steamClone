namespace SteamClone.DAL;

public static class Settings
{
    public static int PasswordLength = 6;
    public const string UserRole = "user";
    public const string AdminRole = "admin";
    public static string HtmlPagesPath = "templates";
    public static string UserImagesPath = "images/user";
    
    public static readonly List<string> ListOfRoles = new()
    {
        AdminRole,
        UserRole
    };
}