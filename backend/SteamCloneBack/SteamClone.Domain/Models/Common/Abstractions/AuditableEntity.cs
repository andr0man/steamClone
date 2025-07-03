using SteamClone.Domain.Models.Common.Interfaces;

namespace SteamClone.Domain.Models.Common.Abstractions;

public class AuditableEntity<T> : Entity<T>, IAuditableEntity<string>
{
    public string? CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; } 
    public string? ModifiedBy { get; set; }
    public DateTime ModifiedAt { get; set; }
}