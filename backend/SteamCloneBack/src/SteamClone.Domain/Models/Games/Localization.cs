using SteamClone.Domain.Common.Abstractions;

namespace SteamClone.Domain.Models.Games;

public class Localization : Entity<string>
{
    public bool Interface { get; set; }
    public bool FullAudio { get; set; }
    public bool Subtitles { get; set; }
    
    public string GameId { get; set; } = null!;
    public int LanguageId { get; set; }
}