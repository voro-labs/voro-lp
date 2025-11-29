using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VoroLp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddNewFieldsToMessageReaction : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "MessageReactions",
                newName: "SentAt");

            migrationBuilder.AddColumn<bool>(
                name: "IsFromMe",
                table: "MessageReactions",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "RemoteFrom",
                table: "MessageReactions",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "RemoteTo",
                table: "MessageReactions",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsFromMe",
                table: "MessageReactions");

            migrationBuilder.DropColumn(
                name: "RemoteFrom",
                table: "MessageReactions");

            migrationBuilder.DropColumn(
                name: "RemoteTo",
                table: "MessageReactions");

            migrationBuilder.RenameColumn(
                name: "SentAt",
                table: "MessageReactions",
                newName: "CreatedAt");
        }
    }
}
