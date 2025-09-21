using System.Text;
using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using MimeKit;
using SteamClone.DAL;
using SteamClone.Domain.Models;
using SteamClone.Domain.Models.Auth;
using SteamClone.Domain.Models.Auth.Users;

namespace SteamClone.BLL.Services.MailService
{
    public class MailService : IMailService
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public MailService(IConfiguration configuration, IWebHostEnvironment webHostEnvironment)
        {
            _configuration = configuration;
            _webHostEnvironment = webHostEnvironment;
        }

        public async Task SendConfirmEmailAsync(User user, string token)
        {
            var address = _configuration["Host:Address"];
            var confirmationUrl = $"{address}/account/emailconfirm?t={token}";

            string messageText = $"Привіт, {user.Nickname}!\n" +
                         $"Перейдіть за посиланням, щоб підтвердити вашу пошту:\n\n" +
                         $"{confirmationUrl}\n\n" +
                         $"Якщо ви не реєструвались — просто ігноруйте цей лист.";

            await SendEmailAsync(user.Email, "Підтвердження пошти", messageText, isHtml: false);

        }

        public async Task SendEmailAsync(IEnumerable<string> to, string subject, string text, bool isHtml = false)
        {
            MimeMessage message = new MimeMessage();
            message.To.AddRange(to.Select(t => InternetAddress.Parse(t)));
            message.Subject = subject;

            BodyBuilder bodyBuilder = new BodyBuilder();

            if (isHtml)
            {
                bodyBuilder.HtmlBody = text;
            }
            else
            {
                bodyBuilder.TextBody = text;
            }

            message.Body = bodyBuilder.ToMessageBody();

            await SendEmailAsync(message);
        }

        public async Task SendEmailAsync(string to, string subject, string text, bool isHtml = false)
        {
            await SendEmailAsync(new[] { to }, subject, text, isHtml);
        }

        public async Task SendEmailAsync(MimeMessage message)
        {
            try
            {
                string password = _configuration["MailSettings:Password"];
                string email = _configuration["MailSettings:Email"];
                string smtp = _configuration["MailSettings:SMTP"];
                int port = int.Parse(_configuration["MailSettings:Port"]);

                message.From.Add(InternetAddress.Parse(email));

                using (var client = new SmtpClient())
                {
                    await client.ConnectAsync(smtp, port, false);
                    await client.AuthenticateAsync(email, password);
                    await client.SendAsync(message);
                }
            }
            catch (Exception)
            {
            }
        }
    }
}
