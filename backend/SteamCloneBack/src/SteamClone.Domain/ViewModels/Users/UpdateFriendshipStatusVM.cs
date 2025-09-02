using SteamClone.Domain.ViewModels.DevelopersAndPublishers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SteamClone.Domain.ViewModels.Users
{
    public class UpdateFriendshipStatusVM
    {
        public required string FriendshipId { get; set; }
        public required string Status { get; set; }
    }
}
