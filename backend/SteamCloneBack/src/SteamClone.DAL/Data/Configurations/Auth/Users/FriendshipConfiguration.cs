using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SteamClone.Domain.Models.Auth.Users;

namespace SteamClone.DAL.Data.Configurations.Auth.Users
{
    public class FriendshipConfiguration : IEntityTypeConfiguration<Friendship>
    {
        public void Configure(EntityTypeBuilder<Friendship> builder)
        {
            builder.HasKey(f => f.Id);

            
            builder.HasOne(f => f.Sender)
                .WithMany(f => f.SentFriendships) 
                .HasForeignKey(f => f.SenderId)
                .OnDelete(DeleteBehavior.Restrict);

            
            builder.HasOne(f => f.Receiver)
                .WithMany(f => f.ReceivedFriendships)
                .HasForeignKey(f => f.ReceiverId)
                .OnDelete(DeleteBehavior.Restrict);

            
            builder.Property(f => f.Status)
                .HasConversion<string>()
                .HasMaxLength(20);

            
        }
    }
}
