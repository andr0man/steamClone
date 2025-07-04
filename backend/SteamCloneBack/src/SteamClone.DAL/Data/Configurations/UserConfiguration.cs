using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SteamClone.DAL.Extensions;
using SteamClone.Domain.Models;
using SteamClone.Domain.Models.Auth;

namespace SteamClone.DAL.Data.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(p => p.Id);

        builder.Property(p => p.Nickname).HasMaxLength(50);
        builder.Property(p => p.EmailConfirmed).HasDefaultValue(false);

        builder.Property(p => p.Email).IsRequired().HasMaxLength(100);
        
        builder.HasIndex(p => p.Email).IsUnique();
        
        builder.Property(x => x.PasswordHash).IsRequired();

        builder.HasOne(x => x.Role)
            .WithMany()
            .HasForeignKey(x => x.RoleId)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.HasOne(x => x.Country)
            .WithMany()
            .HasForeignKey(x => x.CountryId)
            .OnDelete(DeleteBehavior.Restrict);
        
       builder.ConfigureAudit();
    }
}