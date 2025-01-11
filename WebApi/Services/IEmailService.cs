namespace WebApi.Services;

public interface IEmailService
{
    void SendEmail(EmailMessage message);
    Task SendEmailAsync(EmailMessage message);
}