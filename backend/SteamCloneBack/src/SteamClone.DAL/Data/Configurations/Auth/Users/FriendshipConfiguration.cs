using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SteamClone.Domain.Models.Auth.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SteamClone.DAL.Data.Configurations.Auth.Users
{
    public class FriendshipConfiguration : IEntityTypeConfiguration<Friendship>
    {
        public void Configure(EntityTypeBuilder<Friendship> builder)
        {
            builder.HasKey(f => f.Id);

            // Відношення з Sender
            builder.HasOne(f => f.Sender)
                .WithMany() // можна додати колекції в User, якщо треба
                .HasForeignKey(f => f.SenderId)
                .OnDelete(DeleteBehavior.Restrict);

            // Відношення з Receiver
            builder.HasOne(f => f.Receiver)
                .WithMany()
                .HasForeignKey(f => f.ReceiverId)
                .OnDelete(DeleteBehavior.Restrict);

            // Enum → string
            builder.Property(f => f.Status)
                .HasConversion<string>()
                .HasMaxLength(20);

            
        }
    }
}
