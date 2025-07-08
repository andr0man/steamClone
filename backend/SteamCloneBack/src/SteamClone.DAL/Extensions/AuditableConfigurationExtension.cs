using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SteamClone.DAL.Converters;
using SteamClone.Domain.Common.Interfaces;
using SteamClone.Domain.Models.Auth;

namespace SteamClone.DAL.Extensions;

public static class AuditableConfigurationExtension
{
    public static void ConfigureAudit<T>(this EntityTypeBuilder<T> builder)
        where T : class, IAuditableEntity<string>
    {
        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(x => x.CreatedBy)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(x => x.ModifiedBy)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.Property(x => x.CreatedAt)
            .HasConversion(new DateTimeUtcConverter())
            .HasDefaultValueSql("timezone('utc', now())");
        
        builder.Property(x => x.ModifiedAt)
            .HasConversion(new DateTimeUtcConverter())
            .HasDefaultValueSql("timezone('utc', now())");
    }
}