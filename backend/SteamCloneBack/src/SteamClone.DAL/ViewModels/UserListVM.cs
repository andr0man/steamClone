namespace SteamClone.DAL.ViewModels;

public class UserListVM
{
    public int Page { get; set; }
    public int PageCount { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
    public List<UserVM> Users { get; set; } = [];
}