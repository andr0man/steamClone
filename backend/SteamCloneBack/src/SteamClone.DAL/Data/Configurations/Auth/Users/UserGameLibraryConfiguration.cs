using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SteamClone.DAL.Converters;
using SteamClone.Domain.Models.Auth.Users;
using SteamClone.Domain.Models.UserGameLibraries;

namespace SteamClone.DAL.Data.Configurations.Auth.Users;

public class UserGameLibraryConfiguration : IEntityTypeConfiguration<UserGameLibrary>
{
    public void Configure(EntityTypeBuilder<UserGameLibrary> builder)
    {
        builder.HasKey(ug => new { ug.UserId, ug.GameId });

        builder.HasOne<User>()
            .WithMany(ug => ug.GameLibrary)
            .HasForeignKey(ug => ug.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(ug => ug.Game)
            .WithMany()
            .HasForeignKey(ug => ug.GameId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Property(ug => ug.DateAdded)
            .HasConversion(new DateTimeUtcConverter())
            .HasDefaultValueSql("timezone('utc', now())")
            .IsRequired();

        builder.Property(ug => ug.IsFavorite)
            .HasDefaultValue(false);
    }
}