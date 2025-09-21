using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SteamClone.Domain.Models.Games;

namespace SteamClone.DAL.Data.Configurations.Games;

public class SystemRequirementsConfiguration : IEntityTypeConfiguration<SystemRequirements>
{
    public void Configure(EntityTypeBuilder<SystemRequirements> builder)
    {
        builder.HasKey(sr => sr.Id);
        
        builder.HasOne<Game>()
            .WithMany(g => g.SystemRequirements)
            .HasForeignKey(sr => sr.GameId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Property(sr => sr.RequirementType)
            .HasConversion(
                v => v.ToString(), 
                v => (RequirementType)Enum.Parse(typeof(RequirementType), v));
        
        builder.Property(sr => sr.Platform)
            .HasConversion(
                v => v.ToString(), 
                v => (RequirementPlatform)Enum.Parse(typeof(RequirementPlatform), v));
    }
}