using VoroLp.Domain.Entities;
using VoroLp.Domain.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using VoroLp.Domain.Entities.Evolution;

namespace VoroLp.Infrastructure.Factories
{
    public class JasmimDbContext(DbContextOptions<JasmimDbContext> options) : IdentityDbContext<User, Role, Guid,
        IdentityUserClaim<Guid>, UserRole, IdentityUserLogin<Guid>, IdentityRoleClaim<Guid>, IdentityUserToken<Guid>>(options)
    {

        // Expor explicitamente a entidade de junção
        //public DbSet<Exemplo> Exemplo { get; set; }
        public DbSet<UserExtension> UserExtensions { get; set; }
        public DbSet<Instance> Instances { get; set; }
        public DbSet<Contact> Contacts { get; set; }
        public DbSet<Chat> Chats { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<MessageReaction> MessageReactions { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<GroupMember> GroupMembers { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<LandingPageConfig> LandingPageConfigs { get; set; }
        public DbSet<LandingPageContact> LandingPageContacts { get; set; }
        public DbSet<LandingPageSection> LandingPageSections { get; set; }
        public DbSet<LandingPageProposal> LandingPageProposals { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<UserExtension>()
                .HasKey(up => up.UserId);

            builder.Entity<UserExtension>()
                .HasOne(up => up.User)
                .WithOne(u => u.UserExtension)
                .HasForeignKey<UserExtension>(up => up.UserId);

            builder.Entity<User>().ToTable("Users");
            builder.Entity<Role>().ToTable("Roles");
            builder.Entity<UserRole>().ToTable("UserRoles");

            builder.Entity<User>(b =>
            {
                b.Property(u => u.FirstName).HasMaxLength(100);
                b.Property(u => u.LastName).HasMaxLength(100);
                b.Property(u => u.CountryCode).HasMaxLength(3);
                b.Property(u => u.CreatedAt).HasDefaultValueSql("TIMEZONE('utc', NOW())");
                b.Property(u => u.IsActive).HasDefaultValue(true);
            });

            builder.Entity<Role>(b =>
            {
                b.Property(r => r.Name).HasMaxLength(256);
            });

            builder.Entity<UserRole>(b =>
            {
                b.HasKey(ur => new { ur.UserId, ur.RoleId });

                b.HasOne(ur => ur.User)
                    .WithMany(u => u.UserRoles)
                    .HasForeignKey(ur => ur.UserId)
                    .IsRequired();

                b.HasOne(ur => ur.Role)
                    .WithMany(r => r.UserRoles)
                    .HasForeignKey(ur => ur.RoleId)
                    .IsRequired();
            });

            builder.Entity<IdentityUserClaim<Guid>>()
                   .ToTable("UserClaims");
            builder.Entity<IdentityUserLogin<Guid>>()
                   .ToTable("UserLogins");
            builder.Entity<IdentityUserToken<Guid>>()
                   .ToTable("UserTokens");
            builder.Entity<IdentityRoleClaim<Guid>>()
                   .ToTable("RoleClaims");
        }
    }
}
