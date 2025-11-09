using VoroLp.Domain.Enums;
using VoroLp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using VoroLp.Shared.Extensions;
using VoroLp.Application.Services.Base;
using VoroLp.Domain.Interfaces.Repositories;
using VoroLp.Application.Services.Interfaces;
using VoroLp.Application.Services.Interfaces.Email;

namespace VoroLp.Application.Services
{
    public class NotificationService(IMailKitEmailService emailService, INotificationRepository notificationRepository) : ServiceBase<Notification>(notificationRepository), INotificationService
    {
        private readonly IMailKitEmailService _emailService = emailService;
        private readonly INotificationRepository _notificationRepository = notificationRepository;

        public async Task SendWelcomeAsync(string email, string userName)
        {
            var template = await _notificationRepository
                .Query(n => n.Name == NotificationEnum.Welcome.AsText() && n.IsActive).FirstOrDefaultAsync();

            if (template == null)
                throw new InvalidOperationException("Template de e-mail de recepção não encontrado.");

            // Substitui placeholders no corpo e no assunto
            var subject = template.Subject
                .Replace("{UserName}", userName);

            var body = template.Body
                .Replace("{UserName}", userName);

            // Envia o e-mail usando o serviço de e-mail real
            await _emailService.SendAsync(email, subject, body, template.Cc, template.Bcc);
        }

        public async Task SendResetLinkAsync(string email, string userName, string token)
        {
            var template = await _notificationRepository
                .Query(n => n.Name == NotificationEnum.PasswordReset.AsText() && n.IsActive).FirstOrDefaultAsync();

            if (template == null)
                throw new InvalidOperationException("Template de e-mail de reset de senha não encontrado.");

            // Gera o link de reset (ajuste conforme sua URL base)
            var resetLink = $"https://vorolabs.app/admin/reset-password?email={email}&token={token}";

            // Substitui placeholders no corpo e no assunto
            var subject = template.Subject
                .Replace("{UserName}", userName);

            var body = template.Body
                .Replace("{UserName}", userName)
                .Replace("{ResetLink}", resetLink);

            // Envia o e-mail usando o serviço de e-mail real
            await _emailService.SendAsync(email, subject, body, template.Cc, template.Bcc);
        }
    }
}
