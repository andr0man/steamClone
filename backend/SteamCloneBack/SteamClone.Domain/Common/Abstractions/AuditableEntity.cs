using SteamClone.Domain.Common.Interfaces;

namespace SteamClone.Domain.Common.Abstractions;

public class AuditableEntity<T> : Entity<T>, IAuditableEntity<string>
{
    public string? CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; } 
    public string? ModifiedBy { get; set; }
    public DateTime ModifiedAt { get; set; }
}