using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SteamClone.DAL.Converters;
using SteamClone.DAL.Extensions;
using SteamClone.Domain.Models.Publishers;

namespace SteamClone.DAL.Data.Configurations;

public class PublisherConfiguration : IEntityTypeConfiguration<Publisher>
{
    public void Configure(EntityTypeBuilder<Publisher> builder)
    {
        builder.HasKey(p => p.Id);
        
        builder.Property(p => p.Name)
            .IsRequired()
            .HasMaxLength(200);
            
        builder.Property(p => p.Description)
            .HasMaxLength(2000);
            
        builder.Property(p => p.LogoUrl)
            .HasMaxLength(500);
            
        builder.Property(p => p.Website)
            .HasMaxLength(200);
        
        builder.Property(x => x.FoundedDate)
            .HasConversion(new DateTimeUtcConverter())
            .HasDefaultValueSql("timezone('utc', now())");
        
        builder.HasOne(x => x.Country)
            .WithMany()
            .HasForeignKey(x => x.CountryId)
            .OnDelete(DeleteBehavior.SetNull);
        
        builder.ConfigureAudit();
    }
}
