using AutoMapper;
using VoroLp.Application.DTOs;
using VoroLp.Application.DTOs.Identity;
using VoroLp.Application.Services.Interfaces;
using VoroLp.Domain.Entities.Identity;
using VoroLp.Shared.Structs;
using VoroLp.Shared.Utils;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace VoroLp.Application.Services
{
    public class AuthService(IMapper mapper, IOptions<CookieUtil> cookieUtil,
        SignInManager<User> signInManager, UserManager<User> userManager,
        IConfiguration configuration, INotificationService notificationService) : IAuthService
    {
        private readonly SignInManager<User> _signInManager = signInManager;
        private readonly UserManager<User> _userManager = userManager;
        private readonly CookieUtil _cookieUtil = cookieUtil.Value;
        private readonly INotificationService _notificationService = notificationService;
        private readonly IMapper _mapper = mapper;

        public async Task<AuthDto> SignInAsync(SignInDto signInDto)
        {
            var user = await _userManager.FindByEmailAsync(signInDto.Email);

            if (user == null)
                throw new UnauthorizedAccessException("Usuário ou senha inválidos.");

            var result = await _signInManager.CheckPasswordSignInAsync(user, signInDto.Password, false);

            if (!result.Succeeded)
                throw new UnauthorizedAccessException("Usuário ou senha inválidos.");

            var rolesNames = await _userManager.GetRolesAsync(user);

            return await GenerateAuthDto(user, rolesNames);
        }

        public async Task<IEnumerable<IdentityError>> SignUpAsync(SignUpDto signUpDto, ICollection<string> roles)
        {
            var user = new User
            {
                UserName = signUpDto.Email,
                Email = signUpDto.Email,
                UserExtension = new()
            };

            return await SignUpAsync(user, signUpDto.Password, roles);
        }

        public async Task<IEnumerable<IdentityError>> SignUpAsync(User user, string password, ICollection<string> roles)
        {
            var result = await _userManager.CreateAsync(user, password);

            if (!result.Succeeded)
                return result.Errors;

            foreach (var role in roles)
            {
                if (!await _userManager.IsInRoleAsync(user, role.ToString()))
                {
                    await _userManager.AddToRoleAsync(user, role.ToString());
                }
            }

            var userName = !string.IsNullOrEmpty(user.FirstName) ? $"{user.FirstName} {user.LastName}" : $"{user.UserName}";

            await _notificationService.SendWelcomeAsync($"{user.Email}", userName);

            return [];
        }

        public async Task<IEnumerable<IdentityError>> ConfirmEmailAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                return [new IdentityError { Description = "Usuário não encontrado." }]; ;

            if (user.EmailConfirmed)
                return [];

            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var result = await _userManager.ConfirmEmailAsync(user, token);

            return result.Succeeded ? [] : [new IdentityError { Description = "Usuário não encontrado." }];
        }

        public async Task<IEnumerable<IdentityError>> ConfirmEmailAsync(AuthDto authViewModel, string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                return [new IdentityError { Description = "Usuário não encontrado." }];

            var result = await _userManager.ConfirmEmailAsync(user, authViewModel.Token);
            return result.Succeeded ? [] : result.Errors;
        }

        public async Task<IEnumerable<IdentityError>> ForgotPasswordAsync(ForgotPasswordDto forgotPasswordDto)
        {
            var user = await _userManager.FindByEmailAsync(forgotPasswordDto.Email);
            if (user == null)
                return [new IdentityError { Description = "Usuário não encontrado." }];

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            // Aqui você pode enviar o token por email, SMS etc.
            var userName = !string.IsNullOrEmpty(user.FirstName) ? $"{user.FirstName} {user.LastName}" : $"{user.UserName}";

            await _notificationService.SendResetLinkAsync($"{user.Email}", userName, Uri.EscapeDataString(token));

            return [];
        }

        public async Task<IEnumerable<IdentityError>> ResetPasswordAsync(ResetPasswordDto resetPasswordDto)
        {
            var user = await _userManager.FindByEmailAsync(resetPasswordDto.Email);
            if (user == null)
                return [new IdentityError { Description = "Usuário não encontrado." }];

            var result = await _userManager.ResetPasswordAsync(user, resetPasswordDto.Token, resetPasswordDto.NewPassword);
            return result.Succeeded ? [] : result.Errors;
        } 

        public string GenerateRandomPassword()
        {
            // Você pode criar regras mais complexas aqui
            return Guid.NewGuid().ToString("N")[..8] + "@1Aa";
        }

        public async Task<string> GenerateEmailConfirmationTokenAsync(User user)
        {
            return await _userManager.GenerateEmailConfirmationTokenAsync(user);
        }

        public async Task<string> GeneratePasswordResetTokenAsync(User user)
        {
            return await _userManager.GeneratePasswordResetTokenAsync(user);
        }

        private static async Task<List<Claim>> GenerateClaims(User user, IList<string>? rolesNames)
        {
            List<Claim> claims =
            [
                new Claim(ClaimTypes.NameIdentifier, $"{user.Id}"),
                new Claim(CustomClaimTypes.UserName, user.UserName!),
                new Claim(CustomClaimTypes.FirstName, user.FirstName!),
                new Claim(CustomClaimTypes.LastName, user.LastName!),
                new Claim(CustomClaimTypes.UserId, $"{user.Id}"),
                new Claim(CustomClaimTypes.Roles, string.Join(",", rolesNames ?? [])),
                new Claim(JwtRegisteredClaimNames.Email, user.Email!),
                new Claim(JwtRegisteredClaimNames.Jti, $"{Guid.NewGuid()}"),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName!),
                new Claim(JwtRegisteredClaimNames.Name, $"{user.FirstName!} {user.LastName!}"),
                new Claim(JwtRegisteredClaimNames.EmailVerified, $"{user.EmailConfirmed}")
            ];

            if (rolesNames != null && rolesNames!.Any())
            {
                foreach (var roleName in rolesNames)
                {
                    claims.Add(new Claim(ClaimTypes.Role, $"{roleName}"));
                }
            }

            return claims;
        }

        private async Task<AuthDto> GenerateAuthDto(User user, IList<string>? rolesNames)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration.Get<ConfigUtil>()?.JwtKey!));

            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var expiration = DateTime.UtcNow.AddHours(double.Parse(_cookieUtil.ExpireHours));

            var token = new JwtSecurityToken(
                issuer: _cookieUtil.Issuer,
                audience: _cookieUtil.Audience,
                claims: await GenerateClaims(user, rolesNames),
                expires: expiration,
                signingCredentials: credentials
            );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return new AuthDto()
            {
                Expiration = expiration,
                UserId = $"{user.Id}",
                UserName = $"{user.UserName}".ToLower(),
                Email = $"{user.Email}".ToLower(),
                FirstName = $"{user.FirstName}".ToLower(),
                LastName = $"{user.LastName}".ToLower(),
                Token = jwt
            };
        }
    }
}
