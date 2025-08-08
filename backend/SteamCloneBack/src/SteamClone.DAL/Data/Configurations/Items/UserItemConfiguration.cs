using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SteamClone.DAL.Extensions;
using SteamClone.Domain.Models.Auth;
using SteamClone.Domain.Models.Items;

namespace SteamClone.DAL.Data.Configurations.Items;

public class UserItemConfiguration : IEntityTypeConfiguration<UserItem>
{
    public void Configure(EntityTypeBuilder<UserItem> builder)
    {
        builder.HasKey(ui => ui.Id);
        
        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(ui => ui.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.HasOne(ui => ui.Item)
            .WithMany()
            .HasForeignKey(ui => ui.ItemId)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.ConfigureAudit();
    }
}