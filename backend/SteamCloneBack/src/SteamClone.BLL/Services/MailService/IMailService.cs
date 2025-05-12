using MimeKit;
using SteamClone.DAL.Models;

namespace SteamClone.BLL.Services.MailService
{
    public interface IMailService
    {
        Task SendEmailAsync(string to, string subject, string text, bool isHtml = false);
        Task SendEmailAsync(IEnumerable<string> to, string subject, string message, bool isHtml = false);
        Task SendEmailAsync(MimeMessage message);
        Task SendConfirmEmailAsync(User user, string token);
    }
}
