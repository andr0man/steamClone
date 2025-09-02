using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SteamClone.DAL.Converters;
using SteamClone.DAL.Extensions;
using SteamClone.Domain.Models.DevelopersAndPublishers;

namespace SteamClone.DAL.Data.Configurations;

public class DeveloperAndPublisherConfiguration : IEntityTypeConfiguration<DeveloperAndPublisher>
{
    public void Configure(EntityTypeBuilder<DeveloperAndPublisher> builder)
    {
        builder.HasKey(d => d.Id);

        builder.Property(d => d.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(d => d.Description)
            .HasMaxLength(2000);

        builder.Property(d => d.LogoUrl)
            .HasMaxLength(500);

        builder.Property(d => d.Website)
            .HasMaxLength(200);

        builder.Property(x => x.FoundedDate)
            .HasConversion(new DateTimeUtcConverter())
            .HasDefaultValueSql("timezone('utc', now())");

        builder.Property(d => d.IsApproved)
            .IsRequired(false);

        builder.HasOne(x => x.Country)
            .WithMany()
            .HasForeignKey(x => x.CountryId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasMany(d => d.AssociatedUsers)
            .WithMany()
            .UsingEntity(j => j.ToTable("dev_and_pub_associated_users"));;

        builder.ConfigureAudit();
    }
}