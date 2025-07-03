namespace SteamClone.Domain.Models.Common.Abstractions;

public abstract class Entity<T>
{
    public required T Id { get; set; }
}