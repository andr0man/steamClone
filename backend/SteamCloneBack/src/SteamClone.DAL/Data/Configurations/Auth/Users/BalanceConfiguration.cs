using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SteamClone.Domain.Models.Auth.Users;

namespace SteamClone.DAL.Data.Configurations.Auth.Users;

public class BalanceConfiguration : IEntityTypeConfiguration<Balance>
{
    public void Configure(EntityTypeBuilder<Balance> builder)
    {
        builder.HasKey(b => b.Id);
        
        builder.Property(b => b.Amount)
            .HasColumnType("decimal(18,2)");
    }
}