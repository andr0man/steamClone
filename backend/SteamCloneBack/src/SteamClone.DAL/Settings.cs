namespace SteamClone.DAL;

public static class Settings
{
    public static int PasswordLength = 6;
    public const string UserRole = "user";
    public const string AdminRole = "admin";
    
    public static readonly List<string> ListOfRoles = new()
    {
        AdminRole,
        UserRole
    };

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
        
        public static readonly List<string> ListOfDirectoriesNames = new()
        {
            GameCoverImagePathName,
            GameScreenshotImagePathName
        };
    }
}