namespace SteamClone.DAL;

public static class Settings
{
    public static int PasswordLength = 6;

    public static class Roles
    {
        public const string AnyAuthenticated = "AnyAuthenticated";
        public const string AdminOrManager = "AdminOrManager";
        
        public const string UserRole = "user";
        public const string AdminRole = "admin";
        public const string ManagerRole = "manager";
    
        public static readonly List<string> ListOfRoles = new()
        {
            AdminRole,
            UserRole,
            ManagerRole
        };
    }
    
    public static class ImagesPathSettings
    {

        public static string HtmlPagesPath = "templates";
        public static string UserImagesPath = "images/user";

        public const string ImagesPath = "wwwroot/images";
        public const string StaticFileRequestPath = "images";

        public const string GameCoverImagePathName = "game_covers";
        public const string GameCoverImagePath = $"{ImagesPath}/{GameCoverImagePathName}";
        public const string GameCoverImagePathForUrl = $"{StaticFileRequestPath}/{GameCoverImagePathName}";

        public const string GameScreenshotImagePathName = "game_screenshots";
        public const string GameScreenshotImagePath = $"{ImagesPath}/{GameScreenshotImagePathName}";
        public const string GameScreenshotImagePathForUrl = $"{StaticFileRequestPath}/{GameScreenshotImagePathName}";
        
        public const string ItemImagePathName = "item_images";
        public const string ItemImagePath = $"{ImagesPath}/{ItemImagePathName}";
        public const string ItemImagePathForUrl = $"{StaticFileRequestPath}/{ItemImagePathName}";
        

        public const string UserAvatarImagePathName = "user_avatars";
        public const string UserAvatarImagePath = $"{ImagesPath}/{UserAvatarImagePathName}";
        public const string UserAvatarImagePathForUrl = $"{StaticFileRequestPath}/{UserAvatarImagePathName}";

        public static readonly List<string> ListOfDirectoriesNames = new()
        {
            GameCoverImagePathName,
            GameScreenshotImagePathName,
            ItemImagePathName,
            UserAvatarImagePathName
        };
    }
}