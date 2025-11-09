using VoroLp.Application.DTOs;
using VoroLp.Domain.Entities.Identity;
using Microsoft.AspNetCore.Identity;

namespace VoroLp.Application.Services.Interfaces
{
    public interface IAuthService
    {
        // Autenticação
        Task<AuthDto> SignInAsync(SignInDto signInDto);

        // Registro de usuário
        Task<IEnumerable<IdentityError>> SignUpAsync(SignUpDto signUpDto, ICollection<string> roles);
        Task<IEnumerable<IdentityError>> SignUpAsync(User user, string password, ICollection<string> roles);

        // Confirmação de e-mail
        Task<IEnumerable<IdentityError>> ConfirmEmailAsync(string email);
        Task<IEnumerable<IdentityError>> ConfirmEmailAsync(AuthDto authDto, string email);

        // Recuperação de senha
        Task<IEnumerable<IdentityError>> ForgotPasswordAsync(ForgotPasswordDto forgotPasswordDto);
        Task<IEnumerable<IdentityError>> ResetPasswordAsync(ResetPasswordDto resetPasswordDto);

        // Geração de senhas e tokens
        string GenerateRandomPassword();
        Task<string> GenerateEmailConfirmationTokenAsync(User user);
        Task<string> GeneratePasswordResetTokenAsync(User user);
    }
}
