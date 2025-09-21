using SteamClone.Domain.Common.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SteamClone.Domain.Models.Auth.Users
{
    public class Friendship : Entity<string>
    {
        public required string SenderId { get; set; }
        public User? Sender { get; set; }

        public required string ReceiverId { get; set; }
        public User? Receiver { get; set; }

        public FriendshipStatus Status { get; set; } = FriendshipStatus.Pending;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public enum FriendshipStatus
    {
        Pending,
        Accepted,
        Declined
    }
}
