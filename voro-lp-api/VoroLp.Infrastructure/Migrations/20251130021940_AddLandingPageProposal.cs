using System;
using System.Text.Json;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VoroLp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddLandingPageProposal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<JsonDocument>(
                name: "MetaData",
                table: "LandingPageSections",
                type: "jsonb",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "jsonb",
                oldDefaultValueSql: "'{}'::jsonb");

            migrationBuilder.CreateTable(
                name: "LandingPageProposals",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ProposalNumber = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    ClientName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    ClientCompany = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    ClientEmail = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    ClientPhone = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    ProposalDate = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    ValidUntil = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    ProjectTitle = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    ProjectDescription = table.Column<string>(type: "text", nullable: false),
                    ProjectPackage = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    ProjectDuration = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    ProjectStartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ProjectDeliveryDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Scope = table.Column<JsonDocument>(type: "jsonb", nullable: false),
                    Timeline = table.Column<JsonDocument>(type: "jsonb", nullable: false),
                    Deliverables = table.Column<JsonDocument>(type: "jsonb", nullable: false),
                    PaymentTerms = table.Column<JsonDocument>(type: "jsonb", nullable: false),
                    InvestmentDevelopment = table.Column<decimal>(type: "numeric(12,2)", nullable: false),
                    InvestmentInfrastructure = table.Column<decimal>(type: "numeric(12,2)", nullable: false),
                    InvestmentTraining = table.Column<decimal>(type: "numeric(12,2)", nullable: false),
                    InvestmentSupport = table.Column<decimal>(type: "numeric(12,2)", nullable: false),
                    InvestmentTotal = table.Column<decimal>(type: "numeric(12,2)", nullable: false),
                    InvestmentCurrency = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    ContactId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LandingPageProposals", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LandingPageProposals_LandingPageContacts_ContactId",
                        column: x => x.ContactId,
                        principalTable: "LandingPageContacts",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_LandingPageProposals_ContactId",
                table: "LandingPageProposals",
                column: "ContactId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LandingPageProposals");

            migrationBuilder.AlterColumn<string>(
                name: "MetaData",
                table: "LandingPageSections",
                type: "jsonb",
                nullable: false,
                defaultValueSql: "'{}'::jsonb",
                oldClrType: typeof(JsonDocument),
                oldType: "jsonb");
        }
    }
}
