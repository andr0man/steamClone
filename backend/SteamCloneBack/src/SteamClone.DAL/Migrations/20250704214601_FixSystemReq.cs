using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SteamClone.DAL.Migrations
{
    /// <inheritdoc />
    public partial class FixSystemReq : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_system_requirements_games_game_id",
                table: "system_requirements");

            migrationBuilder.AlterColumn<string>(
                name: "game_id",
                table: "system_requirements",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "ix_users_email",
                table: "users",
                column: "email",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "fk_system_requirements_games_game_id",
                table: "system_requirements",
                column: "game_id",
                principalTable: "games",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_system_requirements_games_game_id",
                table: "system_requirements");

            migrationBuilder.DropIndex(
                name: "ix_users_email",
                table: "users");

            migrationBuilder.AlterColumn<string>(
                name: "game_id",
                table: "system_requirements",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddForeignKey(
                name: "fk_system_requirements_games_game_id",
                table: "system_requirements",
                column: "game_id",
                principalTable: "games",
                principalColumn: "id");
        }
    }
}
