using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VoroLp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddQuotedToMessage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "QuotedMessageId",
                table: "Messages",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Messages_QuotedMessageId",
                table: "Messages",
                column: "QuotedMessageId");

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_Messages_QuotedMessageId",
                table: "Messages",
                column: "QuotedMessageId",
                principalTable: "Messages",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Messages_Messages_QuotedMessageId",
                table: "Messages");

            migrationBuilder.DropIndex(
                name: "IX_Messages_QuotedMessageId",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "QuotedMessageId",
                table: "Messages");
        }
    }
}
