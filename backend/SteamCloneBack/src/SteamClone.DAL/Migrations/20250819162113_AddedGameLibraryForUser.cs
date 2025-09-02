using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SteamClone.DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddedGameLibraryForUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_developer_and_publisher_user_developers_and_publishers_deve",
                table: "developer_and_publisher_user");

            migrationBuilder.DropForeignKey(
                name: "fk_developer_and_publisher_user_users_associated_users_id",
                table: "developer_and_publisher_user");

            migrationBuilder.DropForeignKey(
                name: "fk_game_user_games_game_id",
                table: "game_user");

            migrationBuilder.DropForeignKey(
                name: "fk_game_user_users_associated_users_id",
                table: "game_user");

            migrationBuilder.DropPrimaryKey(
                name: "pk_game_user",
                table: "game_user");

            migrationBuilder.DropPrimaryKey(
                name: "pk_developer_and_publisher_user",
                table: "developer_and_publisher_user");

            migrationBuilder.RenameTable(
                name: "game_user",
                newName: "games_associated_users");

            migrationBuilder.RenameTable(
                name: "developer_and_publisher_user",
                newName: "dev_and_pub_associated_users");

            migrationBuilder.RenameIndex(
                name: "ix_game_user_game_id",
                table: "games_associated_users",
                newName: "ix_games_associated_users_game_id");

            migrationBuilder.RenameIndex(
                name: "ix_developer_and_publisher_user_developer_and_publisher_id",
                table: "dev_and_pub_associated_users",
                newName: "ix_dev_and_pub_associated_users_developer_and_publisher_id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_games_associated_users",
                table: "games_associated_users",
                columns: new[] { "associated_users_id", "game_id" });

            migrationBuilder.AddPrimaryKey(
                name: "pk_dev_and_pub_associated_users",
                table: "dev_and_pub_associated_users",
                columns: new[] { "associated_users_id", "developer_and_publisher_id" });

            migrationBuilder.CreateTable(
                name: "user_game_libraries",
                columns: table => new
                {
                    user_id = table.Column<string>(type: "text", nullable: false),
                    game_id = table.Column<string>(type: "text", nullable: false),
                    date_added = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "timezone('utc', now())"),
                    is_favorite = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_user_game_libraries", x => new { x.user_id, x.game_id });
                    table.ForeignKey(
                        name: "fk_user_game_libraries_games_game_id",
                        column: x => x.game_id,
                        principalTable: "games",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_user_game_libraries_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "developers_and_publishers",
                columns: new[] { "id", "country_id", "created_by", "description", "founded_date", "is_approved", "logo_url", "modified_by", "name", "website" },
                values: new object[] { "f47c669f-64d9-40ba-9af3-fcc69fbb285d", 231, null, "DeveloperAndPublisher description", new DateTime(2025, 8, 19, 16, 21, 13, 345, DateTimeKind.Utc).AddTicks(8555), true, null, null, "DeveloperAndPublisher", null });

            migrationBuilder.InsertData(
                table: "genres",
                columns: new[] { "id", "created_by", "description", "modified_by", "name" },
                values: new object[,]
                {
                    { 1, null, null, null, "Action" },
                    { 2, null, null, null, "Adventure" },
                    { 3, null, null, null, "RPG" },
                    { 4, null, null, null, "Strategy" },
                    { 5, null, null, null, "Simulation" },
                    { 6, null, null, null, "Sports" },
                    { 7, null, null, null, "Racing" }
                });

            migrationBuilder.InsertData(
                table: "users",
                columns: new[] { "id", "avatar_url", "bio", "country_id", "created_by", "email", "email_confirmed", "external_provider", "external_provider_key", "level", "modified_by", "nickname", "password_hash", "role_id" },
                values: new object[,]
                {
                    { "31e6de8d-5f55-4543-ac46-429e1ae30fbf", null, null, 231, null, "user@mail.com", true, null, null, 0, null, "User", "7D64D8B0B76B23625CA2804E54F2B9F9562EE3175AD21AB02ACB9AE80E80C970-C8DCFB0B66B8BA472A481750248172C3", "user" },
                    { "42566bf7-481e-491a-89e9-485e8fe57c1c", null, null, 231, null, "admin@mail.com", true, null, null, 0, null, "Admin", "7D64D8B0B76B23625CA2804E54F2B9F9562EE3175AD21AB02ACB9AE80E80C970-C8DCFB0B66B8BA472A481750248172C3", "admin" },
                    { "51c3c6db-071a-4bfe-8cf2-d95984fde5f2", null, null, 231, null, "manager@mail.com", true, null, null, 0, null, "Manager", "7D64D8B0B76B23625CA2804E54F2B9F9562EE3175AD21AB02ACB9AE80E80C970-C8DCFB0B66B8BA472A481750248172C3", "manager" }
                });

            migrationBuilder.InsertData(
                table: "balances",
                columns: new[] { "id", "amount", "user_id" },
                values: new object[,]
                {
                    { "19888aa1-0987-41fa-8b15-87e4f59feb0b", 100m, "51c3c6db-071a-4bfe-8cf2-d95984fde5f2" },
                    { "4b6da6a5-9097-44da-8a13-c5e630df12bb", 100m, "42566bf7-481e-491a-89e9-485e8fe57c1c" },
                    { "9ddcc14b-2123-423e-b591-76688f9ea7d7", 100m, "31e6de8d-5f55-4543-ac46-429e1ae30fbf" }
                });

            migrationBuilder.CreateIndex(
                name: "ix_user_game_libraries_game_id",
                table: "user_game_libraries",
                column: "game_id");

            migrationBuilder.AddForeignKey(
                name: "fk_dev_and_pub_associated_users_developers_and_publishers_deve",
                table: "dev_and_pub_associated_users",
                column: "developer_and_publisher_id",
                principalTable: "developers_and_publishers",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_dev_and_pub_associated_users_users_associated_users_id",
                table: "dev_and_pub_associated_users",
                column: "associated_users_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_games_associated_users_games_game_id",
                table: "games_associated_users",
                column: "game_id",
                principalTable: "games",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_games_associated_users_users_associated_users_id",
                table: "games_associated_users",
                column: "associated_users_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_dev_and_pub_associated_users_developers_and_publishers_deve",
                table: "dev_and_pub_associated_users");

            migrationBuilder.DropForeignKey(
                name: "fk_dev_and_pub_associated_users_users_associated_users_id",
                table: "dev_and_pub_associated_users");

            migrationBuilder.DropForeignKey(
                name: "fk_games_associated_users_games_game_id",
                table: "games_associated_users");

            migrationBuilder.DropForeignKey(
                name: "fk_games_associated_users_users_associated_users_id",
                table: "games_associated_users");

            migrationBuilder.DropTable(
                name: "user_game_libraries");

            migrationBuilder.DropPrimaryKey(
                name: "pk_games_associated_users",
                table: "games_associated_users");

            migrationBuilder.DropPrimaryKey(
                name: "pk_dev_and_pub_associated_users",
                table: "dev_and_pub_associated_users");

            migrationBuilder.DeleteData(
                table: "balances",
                keyColumn: "id",
                keyValue: "19888aa1-0987-41fa-8b15-87e4f59feb0b");

            migrationBuilder.DeleteData(
                table: "balances",
                keyColumn: "id",
                keyValue: "4b6da6a5-9097-44da-8a13-c5e630df12bb");

            migrationBuilder.DeleteData(
                table: "balances",
                keyColumn: "id",
                keyValue: "9ddcc14b-2123-423e-b591-76688f9ea7d7");

            migrationBuilder.DeleteData(
                table: "developers_and_publishers",
                keyColumn: "id",
                keyValue: "f47c669f-64d9-40ba-9af3-fcc69fbb285d");

            migrationBuilder.DeleteData(
                table: "genres",
                keyColumn: "id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "genres",
                keyColumn: "id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "genres",
                keyColumn: "id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "genres",
                keyColumn: "id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "genres",
                keyColumn: "id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "genres",
                keyColumn: "id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "genres",
                keyColumn: "id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "users",
                keyColumn: "id",
                keyValue: "31e6de8d-5f55-4543-ac46-429e1ae30fbf");

            migrationBuilder.DeleteData(
                table: "users",
                keyColumn: "id",
                keyValue: "42566bf7-481e-491a-89e9-485e8fe57c1c");

            migrationBuilder.DeleteData(
                table: "users",
                keyColumn: "id",
                keyValue: "51c3c6db-071a-4bfe-8cf2-d95984fde5f2");

            migrationBuilder.RenameTable(
                name: "games_associated_users",
                newName: "game_user");

            migrationBuilder.RenameTable(
                name: "dev_and_pub_associated_users",
                newName: "developer_and_publisher_user");

            migrationBuilder.RenameIndex(
                name: "ix_games_associated_users_game_id",
                table: "game_user",
                newName: "ix_game_user_game_id");

            migrationBuilder.RenameIndex(
                name: "ix_dev_and_pub_associated_users_developer_and_publisher_id",
                table: "developer_and_publisher_user",
                newName: "ix_developer_and_publisher_user_developer_and_publisher_id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_game_user",
                table: "game_user",
                columns: new[] { "associated_users_id", "game_id" });

            migrationBuilder.AddPrimaryKey(
                name: "pk_developer_and_publisher_user",
                table: "developer_and_publisher_user",
                columns: new[] { "associated_users_id", "developer_and_publisher_id" });

            migrationBuilder.AddForeignKey(
                name: "fk_developer_and_publisher_user_developers_and_publishers_deve",
                table: "developer_and_publisher_user",
                column: "developer_and_publisher_id",
                principalTable: "developers_and_publishers",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_developer_and_publisher_user_users_associated_users_id",
                table: "developer_and_publisher_user",
                column: "associated_users_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

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
