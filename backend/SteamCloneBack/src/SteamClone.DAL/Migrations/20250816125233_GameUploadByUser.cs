using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SteamClone.DAL.Migrations
{
    /// <inheritdoc />
    public partial class GameUploadByUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_balances_users_user_id",
                table: "balances");

            migrationBuilder.AddColumn<int>(
                name: "discount",
                table: "games",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "is_approved",
                table: "games",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "is_approved",
                table: "developers_and_publishers",
                type: "boolean",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "developer_and_publisher_user",
                columns: table => new
                {
                    associated_users_id = table.Column<string>(type: "text", nullable: false),
                    developer_and_publisher_id = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_developer_and_publisher_user", x => new { x.associated_users_id, x.developer_and_publisher_id });
                    table.ForeignKey(
                        name: "fk_developer_and_publisher_user_developers_and_publishers_deve",
                        column: x => x.developer_and_publisher_id,
                        principalTable: "developers_and_publishers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_developer_and_publisher_user_users_associated_users_id",
                        column: x => x.associated_users_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "game_user",
                columns: table => new
                {
                    associated_users_id = table.Column<string>(type: "text", nullable: false),
                    game_id = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_game_user", x => new { x.associated_users_id, x.game_id });
                    table.ForeignKey(
                        name: "fk_game_user_games_game_id",
                        column: x => x.game_id,
                        principalTable: "games",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_game_user_users_associated_users_id",
                        column: x => x.associated_users_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "roles",
                columns: new[] { "id", "name" },
                values: new object[] { "manager", "manager" });

            migrationBuilder.CreateIndex(
                name: "ix_developer_and_publisher_user_developer_and_publisher_id",
                table: "developer_and_publisher_user",
                column: "developer_and_publisher_id");

            migrationBuilder.CreateIndex(
                name: "ix_game_user_game_id",
                table: "game_user",
                column: "game_id");

            migrationBuilder.AddForeignKey(
                name: "fk_balances_users_user_id",
                table: "balances",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_balances_users_user_id",
                table: "balances");

            migrationBuilder.DropTable(
                name: "developer_and_publisher_user");

            migrationBuilder.DropTable(
                name: "game_user");

            migrationBuilder.DeleteData(
                table: "roles",
                keyColumn: "id",
                keyValue: "manager");

            migrationBuilder.DropColumn(
                name: "discount",
                table: "games");

            migrationBuilder.DropColumn(
                name: "is_approved",
                table: "games");

            migrationBuilder.DropColumn(
                name: "is_approved",
                table: "developers_and_publishers");

            migrationBuilder.AddForeignKey(
                name: "fk_balances_users_user_id",
                table: "balances",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
