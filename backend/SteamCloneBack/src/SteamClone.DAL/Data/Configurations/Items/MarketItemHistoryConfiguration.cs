using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SteamClone.DAL.Converters;
using SteamClone.Domain.Models.Auth.Users;
using SteamClone.Domain.Models.Items;

namespace SteamClone.DAL.Data.Configurations.Items;

public class MarketItemHistoryConfiguration : IEntityTypeConfiguration<MarketItemHistory>
{
    public void Configure(EntityTypeBuilder<MarketItemHistory> builder)
    {
        builder.HasKey(mi => mi.Id);
        
        builder.HasOne(mi => mi.UserItem)
            .WithMany()
            .HasForeignKey(mi => mi.UserItemId)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(x => x.SellerId)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(x => x.BuyerId)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.Property(mi => mi.Price)
            .HasColumnType("decimal(18,2)");
        
        builder.Property(x => x.Date)
            .HasConversion(new DateTimeUtcConverter())
            .HasDefaultValueSql("timezone('utc', now())");
    }
}