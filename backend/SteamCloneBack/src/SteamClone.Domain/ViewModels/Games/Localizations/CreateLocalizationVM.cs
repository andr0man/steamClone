namespace SteamClone.Domain.ViewModels.Games.Localizations;

public class CreateLocalizationVM : UpdateLocalizationVM
{
    public string GameId { get; set; } = null!;
    public int LanguageId { get; set; }
}