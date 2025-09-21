using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SteamClone.DAL.Extensions;
using SteamClone.Domain.Models.Items;

namespace SteamClone.DAL.Data.Configurations.Items;

public class MarketItemConfiguration : IEntityTypeConfiguration<MarketItem>
{
    public void Configure(EntityTypeBuilder<MarketItem> builder)
    {
        builder.HasKey(mi => mi.Id);
        
        builder.HasOne(mi => mi.UserItem)
            .WithMany()
            .HasForeignKey(mi => mi.UserItemId)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.Property(mi => mi.Price)
            .HasColumnType("decimal(18,2)");
        
        builder.ConfigureAudit();
    }
}