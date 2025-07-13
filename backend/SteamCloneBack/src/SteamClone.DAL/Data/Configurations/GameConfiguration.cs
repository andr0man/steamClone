using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SteamClone.DAL.Extensions;
using SteamClone.Domain.Models.Games;

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
            
        builder.HasOne(e => e.Developer)
            .WithMany()
            .HasForeignKey(e => e.DeveloperId)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.HasOne(e => e.Publisher)
            .WithMany()
            .HasForeignKey(e => e.PublisherId)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.ConfigureAudit();
    }
}