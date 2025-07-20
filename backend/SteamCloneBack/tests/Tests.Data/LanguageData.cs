using SteamClone.Domain.Models.Languages;

namespace Tests.Data;

public class LanguageData
{
    public static Language MainLanguage => new()
    {
        Id = 0,
        Name = "MainLanguage",
        Code = "MA",
    };
}