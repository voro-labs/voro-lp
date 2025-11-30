using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;
using VoroLp.Domain.Enums;

namespace VoroLp.Domain.Entities
{
    public class LandingPageProposal
    {
        public Guid Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string ProposalNumber { get; set; } = string.Empty;

        public ProposalStatusEnum Status { get; set; } = ProposalStatusEnum.Pending;

        // Dados do cliente
        [Required]
        [MaxLength(255)]
        public string ClientName { get; set; } = string.Empty;

        [MaxLength(255)]
        public string ClientCompany { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        public string ClientEmail { get; set; } = string.Empty;

        [MaxLength(50)]
        public string ClientPhone { get; set; } = string.Empty;

        public DateTimeOffset ProposalDate { get; set; }

        public DateTimeOffset ValidUntil { get; set; }

        // Dados do projeto
        [Required]
        [MaxLength(500)]
        public string ProjectTitle { get; set; } = string.Empty;

        public string ProjectDescription { get; set; } = string.Empty;

        [MaxLength(100)]
        public string ProjectPackage { get; set; } = string.Empty;

        [MaxLength(100)]
        public string ProjectDuration { get; set; } = string.Empty;

        public DateTime? ProjectStartDate { get; set; }

        public DateTime? ProjectDeliveryDate { get; set; }

        // JSON arrays ===============================
        [Column(TypeName = "jsonb")]
        public JsonDocument Scope { get; set; } = JsonDocument.Parse("{}");

        [Column(TypeName = "jsonb")]
        public JsonDocument Timeline { get; set; } = JsonDocument.Parse("{}");

        [Column(TypeName = "jsonb")]
        public JsonDocument Deliverables { get; set; } = JsonDocument.Parse("{}");

        [Column(TypeName = "jsonb")]
        public JsonDocument PaymentTerms { get; set; } = JsonDocument.Parse("{}");

        // Investimentos
        [Column(TypeName = "numeric(12,2)")]
        public decimal InvestmentDevelopment { get; set; }

        [Column(TypeName = "numeric(12,2)")]
        public decimal InvestmentInfrastructure { get; set; }

        [Column(TypeName = "numeric(12,2)")]
        public decimal InvestmentTraining { get; set; }

        [Column(TypeName = "numeric(12,2)")]
        public decimal InvestmentSupport { get; set; }

        [Column(TypeName = "numeric(12,2)")]
        public decimal InvestmentTotal { get; set; }

        [MaxLength(10)]
        public string InvestmentCurrency { get; set; } = "R$";

        // FK message
        public Guid? ContactId { get; set; }
        public LandingPageContact? Contact { get; set; }

        // timestamps
        public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
        public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
    }
}
