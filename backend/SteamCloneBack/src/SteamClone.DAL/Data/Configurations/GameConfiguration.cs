using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SteamClone.DAL.Extensions;
using SteamClone.Domain.Models.Developers;
using SteamClone.Domain.Models.Games;
using SteamClone.Domain.Models.Publishers;

namespace SteamClone.DAL.Data.Configurations;

public class GameConfiguration : IEntityTypeConfiguration<Game>
{
    public void Configure(EntityTypeBuilder<Game> builder)
    {
        builder.HasKey(e => e.Id);

        builder.Property(e => e.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(e => e.Description)
            .IsRequired()
            .HasMaxLength(1000);

        builder.Property(e => e.ReleaseDate)
            .IsRequired();

        builder.Property(e => e.Price)
            .IsRequired()
            .HasColumnType("decimal(18,2)");

        builder.HasMany(e => e.Genres)
            .WithMany();
            
        builder.HasOne(g => g.Developer)
            .WithMany()
            .HasForeignKey(g => g.DeveloperId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Restrict);
            
        builder.HasOne(g => g.Publisher)
            .WithMany()
            .HasForeignKey(g => g.PublisherId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.ConfigureAudit();
    }
}