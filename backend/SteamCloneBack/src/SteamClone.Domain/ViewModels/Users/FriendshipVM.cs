using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SteamClone.Domain.ViewModels.Users
{
    public class FriendshipVM
    {
        public required string Id { get; set; }
        public required string SenderId { get; set; }
        public required string ReceiverId { get; set; }
        public required string Status { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
