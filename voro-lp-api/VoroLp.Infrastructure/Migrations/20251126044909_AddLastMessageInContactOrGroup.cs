using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VoroLp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddLastMessageInContactOrGroup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LastMessage",
                table: "Groups",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "LastMessageFromMe",
                table: "Groups",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "LastMessageFromMe",
                table: "Contacts",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastMessage",
                table: "Groups");

            migrationBuilder.DropColumn(
                name: "LastMessageFromMe",
                table: "Groups");

            migrationBuilder.DropColumn(
                name: "LastMessageFromMe",
                table: "Contacts");
        }
    }
}
