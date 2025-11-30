using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VoroLp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddIsDeletePageContact : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "LandingPageContacts",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "LandingPageContacts");
        }
    }
}
