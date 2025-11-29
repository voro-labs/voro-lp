using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VoroLp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddInfoImageAndInfoVideoToMessage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DurationSeconds",
                table: "Messages",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "FileLength",
                table: "Messages",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FileUrl",
                table: "Messages",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Height",
                table: "Messages",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MimeType",
                table: "Messages",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "Thumbnail",
                table: "Messages",
                type: "bytea",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Width",
                table: "Messages",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DurationSeconds",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "FileLength",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "FileUrl",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "Height",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "MimeType",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "Thumbnail",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "Width",
                table: "Messages");
        }
    }
}
