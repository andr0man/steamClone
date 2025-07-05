using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
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
    }
}