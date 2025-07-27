using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SteamClone.Domain.ViewModels.Users
{
    public class UserProfileVM
    {
        public required string Id { get; set; }
        public required string Nickname { get; set; }
        public required string Email { get; set; }
        public string? AvatarUrl { get; set; }
        public string? Bio { get; set; }
        public int Level { get; set; }
        public string? CountryName { get; set; }
        public string? RoleName { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
