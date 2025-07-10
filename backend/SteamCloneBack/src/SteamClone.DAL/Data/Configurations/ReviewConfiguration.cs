using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SteamClone.Domain.Models.Games;

namespace SteamClone.DAL.Data.Configurations;

public class ReviewConfiguration : IEntityTypeConfiguration<Review>
{
    public void Configure(EntityTypeBuilder<Review> builder)
    {
        builder.HasKey(r => r.Id);

        builder.Property(r => r.Text);

        builder.Property(r => r.IsPositive);
        
        builder.HasOne<Game>()
            .WithMany()
            .HasForeignKey(sr => sr.GameId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}