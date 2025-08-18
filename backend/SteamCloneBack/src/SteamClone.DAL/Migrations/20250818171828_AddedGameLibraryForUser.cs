using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SteamClone.DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddedGameLibraryForUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_game_user_games_game_id",
                table: "game_user");

            migrationBuilder.DropForeignKey(
                name: "fk_game_user_users_associated_users_id",
                table: "game_user");

            migrationBuilder.DropPrimaryKey(
                name: "pk_game_user",
                table: "game_user");

            migrationBuilder.RenameTable(
                name: "game_user",
                newName: "users_games_library");

            migrationBuilder.RenameColumn(
                name: "game_id",
                table: "users_games_library",
                newName: "user_id");

            migrationBuilder.RenameColumn(
                name: "associated_users_id",
                table: "users_games_library",
                newName: "games_id");

            migrationBuilder.RenameIndex(
                name: "ix_game_user_game_id",
                table: "users_games_library",
                newName: "ix_users_games_library_user_id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_users_games_library",
                table: "users_games_library",
                columns: new[] { "games_id", "user_id" });

            migrationBuilder.CreateTable(
                name: "games_associated_users",
                columns: table => new
                {
                    associated_games_id = table.Column<string>(type: "text", nullable: false),
                    associated_users_id = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_games_associated_users", x => new { x.associated_games_id, x.associated_users_id });
                    table.ForeignKey(
                        name: "fk_games_associated_users_games_associated_games_id",
                        column: x => x.associated_games_id,
                        principalTable: "games",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_games_associated_users_users_associated_users_id",
                        column: x => x.associated_users_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_games_associated_users_associated_users_id",
                table: "games_associated_users",
                column: "associated_users_id");

            migrationBuilder.AddForeignKey(
                name: "fk_users_games_library_games_games_id",
                table: "users_games_library",
                column: "games_id",
                principalTable: "games",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_users_games_library_users_user_id",
                table: "users_games_library",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_users_games_library_games_games_id",
                table: "users_games_library");

            migrationBuilder.DropForeignKey(
                name: "fk_users_games_library_users_user_id",
                table: "users_games_library");

            migrationBuilder.DropTable(
                name: "games_associated_users");

            migrationBuilder.DropPrimaryKey(
                name: "pk_users_games_library",
                table: "users_games_library");

            migrationBuilder.RenameTable(
                name: "users_games_library",
                newName: "game_user");

            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "game_user",
                newName: "game_id");

            migrationBuilder.RenameColumn(
                name: "games_id",
                table: "game_user",
                newName: "associated_users_id");

            migrationBuilder.RenameIndex(
                name: "ix_users_games_library_user_id",
                table: "game_user",
                newName: "ix_game_user_game_id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_game_user",
                table: "game_user",
                columns: new[] { "associated_users_id", "game_id" });

            migrationBuilder.AddForeignKey(
                name: "fk_game_user_games_game_id",
                table: "game_user",
                column: "game_id",
                principalTable: "games",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_game_user_users_associated_users_id",
                table: "game_user",
                column: "associated_users_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
