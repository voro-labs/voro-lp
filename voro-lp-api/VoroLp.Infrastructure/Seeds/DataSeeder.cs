using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Text.Json;
using VoroLp.Domain.Entities;
using VoroLp.Domain.Entities.Evolution;
using VoroLp.Domain.Entities.Identity;
using VoroLp.Domain.Enums;
using VoroLp.Infrastructure.Factories;
using VoroLp.Shared.Constants;
using VoroLp.Shared.Extensions;

namespace VoroLp.Infrastructure.Seeds
{
    public class DataSeeder : IDataSeeder
    {
        public async Task SeedAsync(JasmimDbContext context)
        {
            // Garante que o banco existe e está migrado
            await context.Database.MigrateAsync();
            
            // SEED: Notifications
            SeedLandingPageConfigs(context);

            await context.SaveChangesAsync();

            // SEED: Notifications
            SeedNotifications(context);

            await context.SaveChangesAsync();

            // SEED: Roles
            SeedRoles(context);
            
            await context.SaveChangesAsync();

            // SEED: Usuário Admin
            SeedUsers(context);

            await context.SaveChangesAsync();
        }

        private static void SeedLandingPageConfigs(JasmimDbContext context)
        {
            if (!context.LandingPageConfigs.Any())
            {
                var landingPageConfigs = new List<LandingPageConfig>
                {
                    new()
                    {
                        Id = Guid.NewGuid(),
                        StartDate = DateTime.UtcNow,
                        EndDate = DateTime.UtcNow.AddYears(5),
                        Slug = "Home",
                        Sections = [
                            new LandingPageSection
                            {
                                Id = Guid.NewGuid(),
                                SectionType = "Hero",
                                MetaData = JsonDocument.Parse("""
                                {
                                    "subtitle": "Desenvolvemos sistemas, páginas e automações que conectam você aos seus clientes."
                                }
                                """),
                                IsVisible = true,
                                Order = 1
                            },
                            new LandingPageSection
                            {
                                Id = Guid.NewGuid(),
                                SectionType = "About",
                                HtmlContent = """
                                    <p>
                                      A VoroLabs é uma empresa especializada em soluções digitais personalizadas, ajudando empresas e
                                      profissionais a expandirem seus negócios através da tecnologia.
                                    </p>
                                    <p>
                                      Nossa missão é transformar ideias em realidade digital, criando sistemas, páginas web e automações que
                                      realmente fazem diferença no dia a dia dos nossos clientes. Combinamos expertise técnica com compreensão
                                      profunda das necessidades do negócio.
                                    </p>
                                    <p>
                                      Com foco em qualidade, inovação e resultados, trabalhamos lado a lado com nossos parceiros para
                                      desenvolver soluções que não apenas atendem, mas superam expectativas.
                                    </p>
                                """,
                                IsVisible = true,
                                Order = 1
                            },
                            new LandingPageSection
                            {
                                Id = Guid.NewGuid(),
                                SectionType = "Process",
                                MetaData = JsonDocument.Parse("""
                                {
                                  "steps": [
                                    {
                                      "icon": "Search",
                                      "title": "Entendimento da necessidade",
                                      "description": "Analisamos profundamente suas demandas e objetivos para criar a solução ideal."
                                    },
                                    {
                                      "icon": "Code2",
                                      "title": "Desenvolvimento personalizado",
                                      "description": "Construímos sua solução com tecnologias modernas e práticas recomendadas."
                                    },
                                    {
                                      "icon": "Rocket",
                                      "title": "Entrega e suporte contínuo",
                                      "description": "Lançamos seu projeto e oferecemos suporte para garantir o sucesso contínuo."
                                    }
                                  ]
                                }
                                """),
                                IsVisible = true,
                                Order = 1
                            },
                            new LandingPageSection
                            {
                                Id = Guid.NewGuid(),
                                SectionType = "Services",
                                MetaData = JsonDocument.Parse("""
                                {
                                  "services": [
                                    {
                                      "icon": "Code",
                                      "title": "Desenvolvimento de Sistemas",
                                      "description": "Sistemas web e painéis administrativos personalizados para gerenciar seu negócio com eficiência."
                                    },
                                    {
                                      "icon": "Globe",
                                      "title": "Páginas e Landing Pages",
                                      "description": "Sites institucionais e landing pages otimizadas para conversão e performance."
                                    },
                                    {
                                      "icon": "Zap",
                                      "title": "Automações Inteligentes",
                                      "description": "Integração com WhatsApp, Telegram, Instagram, e-mail e outros canais para automatizar processos."
                                    },
                                    {
                                      "icon": "Smartphone",
                                      "title": "Aplicativos Mobile",
                                      "description": "Apps nativos para Android e iOS conectados ao seu sistema, expandindo seu alcance."
                                    }
                                  ]
                                }
                                """),
                                IsVisible = true,
                                Order = 1
                            },
                            new LandingPageSection
                            {
                                Id = Guid.NewGuid(),
                                SectionType = "Contact",
                                MetaData = JsonDocument.Parse("""
                                {
                                    "whatsapp": "5511999999999",
                                    "email": "contato@vorolabs.app"
                                }
                                """),
                                IsVisible = true,
                                Order = 1
                            },
                            new LandingPageSection
                            {
                                Id = Guid.NewGuid(),
                                SectionType = "Footer",
                                MetaData = JsonDocument.Parse("""
                                {
                                    "linkedin": "https://linkedin.com/company/vorolabs",
                                    "instagram": "https://instagram.com/vorolabs",
                                    "github": "https://github.com/voro-labs"
                                }
                                """),
                                IsVisible = true,
                                Order = 1
                            },
                        ],
                        IsActive = true
                    }
                };

                context.LandingPageConfigs.AddRange(landingPageConfigs);
            }
        }

        private static void SeedNotifications(JasmimDbContext context)
        {
            if (!context.Notifications.Any())
            {
                var notifications = new List<Notification>
                {
                    new()
                    {
                        Id = Guid.NewGuid(),
                        Name = NotificationEnum.Welcome.AsText(),
                        Subject = "Bem-vindo(a) ao sistema, {UserName}!",
                        Body = @"
                            <div style='font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 30px;'>
                                <div style='max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);'>
                                    <h2 style='color: #333333; text-align: center;'>Bem-vindo(a), {UserName}!</h2>
                                    <p style='color: #555555; font-size: 16px;'>Olá <strong>{UserName}</strong>,</p>
                                    <p style='color: #555555; font-size: 16px;'>
                                        Sua conta foi criada com sucesso! Estamos muito felizes em tê-lo(a) conosco.
                                    </p>
                                    <p style='color: #555555; font-size: 16px;'>
                                        Explore os recursos disponíveis e aproveite ao máximo sua experiência no sistema.
                                    </p>
                                    <br/>
                                    <p style='font-size: 15px; color: #888888; text-align: center;'>
                                        Atenciosamente,<br/>
                                        <strong>Equipe Suporte</strong>
                                    </p>
                                </div>
                            </div>",
                        CreatedAt = DateTime.UtcNow,
                        IsActive = true
                    },

                    new()
                    {
                        Id = Guid.NewGuid(),
                        Name = NotificationEnum.PasswordReset.AsText(),
                        Subject = "Redefinição de Senha - {UserName}",
                        Body = @"
                            <div style='font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 30px;'>
                                <div style='max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);'>
                                    <h2 style='color: #333333; text-align: center;'>Redefinição de Senha</h2>
                                    <p style='color: #555555; font-size: 16px;'>Olá <strong>{UserName}</strong>,</p>
                                    <p style='color: #555555; font-size: 16px;'>
                                        Recebemos uma solicitação para redefinir sua senha. Para continuar, clique no botão abaixo:
                                    </p>
                                    <div style='text-align: center; margin: 25px 0;'>
                                        <a href='{ResetLink}' style='background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;'>
                                            Redefinir Senha
                                        </a>
                                    </div>
                                    <p style='color: #777777; font-size: 14px;'>
                                        Se você não solicitou essa alteração, basta ignorar este e-mail.
                                    </p>
                                    <br/>
                                    <p style='font-size: 15px; color: #888888; text-align: center;'>
                                        Atenciosamente,<br/>
                                        <strong>Equipe Suporte</strong>
                                    </p>
                                </div>
                            </div>",
                        CreatedAt = DateTime.UtcNow,
                        IsActive = true
                    }
                };

                context.Notifications.AddRange(notifications);
            }
        }

        private static void SeedRoles(JasmimDbContext context)
        {
            if (!context.Roles.Any())
            {
                var roles = typeof(RoleConstant)
                    .GetFields(System.Reflection.BindingFlags.Public |
                                System.Reflection.BindingFlags.Static |
                                System.Reflection.BindingFlags.FlattenHierarchy)
                    .Where(fi => fi.IsLiteral && !fi.IsInitOnly)
                    .Select(fi => new Role
                    {
                        Id = Guid.Parse((string)fi.GetRawConstantValue()!),
                        Name = fi.Name.ToTitleCase(),
                        NormalizedName = fi.Name.ToUpper()
                    })
                    .ToList();

                context.Roles.AddRange(roles);
            }
        }

        private static void SeedUsers(JasmimDbContext context)
        {
            if (!context.Users.Any())
            {
                var adminRole = context.Roles.FirstOrDefault(r => r.Name == "Admin");

                var admin = new User
                {
                    UserName = "admin",
                    NormalizedUserName = "admin".ToUpper(),
                    Email = "contato@vorolabs.app",
                    NormalizedEmail = "contato@vorolabs.app".ToUpper(),
                    FirstName = "System",
                    LastName = "Administrator",
                    CountryCode = "BR",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    BirthDate = DateTime.UtcNow,
                    SecurityStamp = "f87c07d8-3b68-4e35-b1e9-97c9021cf4e8",
                    UserRoles = [
                        new UserRole()
                        {
                            Role = adminRole
                        }
                    ],
                    UserExtension = new UserExtension
                    {
                        Instances = [
                            new Instance
                            {
                                Name = "voro-evolution"
                            }
                        ]
                    }
                };

                context.Users.Add(admin);
            }
        }
    }
}
