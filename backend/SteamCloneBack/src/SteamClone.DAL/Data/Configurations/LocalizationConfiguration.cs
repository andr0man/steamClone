using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SteamClone.Domain.Models.Games;
using SteamClone.Domain.Models.Languages;

namespace SteamClone.DAL.Data.Configurations;

public class LocalizationConfiguration : IEntityTypeConfiguration<Localization>
{
    public void Configure(EntityTypeBuilder<Localization> builder)
    {
        builder.HasKey(l => l.Id);
        
        builder.Property(l => l.Interface).IsRequired();
        
        builder.Property(l => l.Subtitles).IsRequired();
        
        builder.Property(l => l.FullAudio).IsRequired();
        
        builder.HasOne<Language>()
            .WithMany()
            .HasForeignKey(x => x.LanguageId)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.HasOne<Game>()
            .WithMany(g => g.Localizations)
            .HasForeignKey(sr => sr.GameId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}