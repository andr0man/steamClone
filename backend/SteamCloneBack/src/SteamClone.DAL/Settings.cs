namespace SteamClone.DAL;

public class Settings
{
    public static int PasswordLength = 6;
    public static string UserRole = "user";
    public static string AdminRole = "admin";
    public static string HtmlPagesPath = "templates";
    public static string UserImagesPath = "images/user";
    
    public static readonly List<string> ListOfRoles = new()
    {
        AdminRole,
        UserRole
    };
}