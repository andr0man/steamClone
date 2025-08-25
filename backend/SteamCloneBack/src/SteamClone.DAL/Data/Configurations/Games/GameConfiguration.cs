using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SteamClone.DAL.Extensions;
using SteamClone.Domain.Models.Games;

namespace SteamClone.DAL.Data.Configurations.Games;

public class GameConfiguration : IEntityTypeConfiguration<Game>
{
    public void Configure(EntityTypeBuilder<Game> builder)
    {
        builder.HasKey(g => g.Id);

        builder.Property(g => g.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(g => g.Description)
            .IsRequired()
            .HasMaxLength(1000);

        builder.Property(g => g.ReleaseDate)
            .IsRequired();

        builder.Property(g => g.PercentageOfPositiveReviews)
            .IsRequired(false);

        builder.Property(g => g.Price)
            .IsRequired()
            .HasColumnType("decimal(18,2)");

        builder.Property(g => g.IsApproved)
            .IsRequired(false);

        builder.Property(g => g.Discount)
            .IsRequired(false);

        builder.HasMany(g => g.Genres)
            .WithMany();

        builder.HasOne(g => g.Developer)
            .WithMany()
            .HasForeignKey(g => g.DeveloperId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(g => g.Publisher)
            .WithMany()
            .HasForeignKey(g => g.PublisherId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(g => g.AssociatedUsers)
            .WithMany()
            .UsingEntity(j => j.ToTable("games_associated_users"));

        builder.ConfigureAudit();
    }
}