namespace SteamClone.DAL.Models.Common.Interfaces;

public interface IAuditableEntity<T>
{
    public T? CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; }
    public T? ModifiedBy { get; set; }
    public DateTime ModifiedAt { get; set; }
}