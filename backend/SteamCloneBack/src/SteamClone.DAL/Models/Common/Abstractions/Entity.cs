namespace SteamClone.DAL.Models.Common.Interfaces
{
    public abstract class Entity<T>
    {
        public T Id { get; set; } = default!;
    }
}
