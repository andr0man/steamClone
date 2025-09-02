using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SteamClone.DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddedWishlist : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "balances",
                keyColumn: "id",
                keyValue: "22c0fe80-d253-4aa9-ab8f-8b41ad350bd9");

            migrationBuilder.DeleteData(
                table: "balances",
                keyColumn: "id",
                keyValue: "561d6d73-d03b-4616-84d6-8dc4d7a080fd");

            migrationBuilder.DeleteData(
                table: "balances",
                keyColumn: "id",
                keyValue: "c784dc40-3048-4e2c-8efa-78f454aef4d8");

            migrationBuilder.DeleteData(
                table: "developers_and_publishers",
                keyColumn: "id",
                keyValue: "14797ced-77c7-457c-91d6-da214ffa97ba");

            migrationBuilder.DeleteData(
                table: "users",
                keyColumn: "id",
                keyValue: "5c0d6c29-f4fb-45fc-bba9-5ae14da286c0");

            migrationBuilder.DeleteData(
                table: "users",
                keyColumn: "id",
                keyValue: "e2397ea1-6d88-4d11-88f4-951b57ef65e2");

            migrationBuilder.DeleteData(
                table: "users",
                keyColumn: "id",
                keyValue: "fd46d035-183c-45ea-8315-30ec9a200061");

            migrationBuilder.CreateTable(
                name: "wishlists",
                columns: table => new
                {
                    user_id = table.Column<string>(type: "text", nullable: false),
                    game_id = table.Column<string>(type: "text", nullable: false),
                    date_added = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "timezone('utc', now())"),
                    rank = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_wishlists", x => new { x.user_id, x.game_id });
                    table.ForeignKey(
                        name: "fk_wishlists_games_game_id",
                        column: x => x.game_id,
                        principalTable: "games",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_wishlists_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "developers_and_publishers",
                columns: new[] { "id", "country_id", "created_by", "description", "founded_date", "is_approved", "logo_url", "modified_by", "name", "website" },
                values: new object[] { "969ff063-ae4d-4c47-a1c7-f6a8dde2895a", 231, null, "DeveloperAndPublisher description", new DateTime(2025, 8, 26, 8, 34, 39, 63, DateTimeKind.Utc).AddTicks(3773), true, null, null, "DeveloperAndPublisher", null });

            migrationBuilder.InsertData(
                table: "users",
                columns: new[] { "id", "avatar_url", "bio", "country_id", "created_by", "email", "email_confirmed", "external_provider", "external_provider_key", "level", "modified_by", "nickname", "password_hash", "role_id" },
                values: new object[,]
                {
                    { "2afc2366-1846-49b3-aaf6-b29458755e97", null, null, 231, null, "user@mail.com", true, null, null, 0, null, "User", "7D64D8B0B76B23625CA2804E54F2B9F9562EE3175AD21AB02ACB9AE80E80C970-C8DCFB0B66B8BA472A481750248172C3", "user" },
                    { "4f9afe94-0f58-4e28-9eab-3aba49af52e0", null, null, 231, null, "admin@mail.com", true, null, null, 0, null, "Admin", "7D64D8B0B76B23625CA2804E54F2B9F9562EE3175AD21AB02ACB9AE80E80C970-C8DCFB0B66B8BA472A481750248172C3", "admin" },
                    { "d2ddfc6e-5c8e-4632-a7c0-7009a293f324", null, null, 231, null, "manager@mail.com", true, null, null, 0, null, "Manager", "7D64D8B0B76B23625CA2804E54F2B9F9562EE3175AD21AB02ACB9AE80E80C970-C8DCFB0B66B8BA472A481750248172C3", "manager" }
                });

            migrationBuilder.InsertData(
                table: "balances",
                columns: new[] { "id", "amount", "user_id" },
                values: new object[,]
                {
                    { "3ac69458-3d4f-472b-bf43-d0d3a6560ccf", 100m, "2afc2366-1846-49b3-aaf6-b29458755e97" },
                    { "cf945d28-948a-46fd-8b13-9930ab0005d2", 100m, "4f9afe94-0f58-4e28-9eab-3aba49af52e0" },
                    { "d5e4ea01-292f-466b-8402-716c59ee5e3f", 100m, "d2ddfc6e-5c8e-4632-a7c0-7009a293f324" }
                });

            migrationBuilder.CreateIndex(
                name: "ix_wishlists_game_id",
                table: "wishlists",
                column: "game_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "wishlists");

            migrationBuilder.DeleteData(
                table: "balances",
                keyColumn: "id",
                keyValue: "3ac69458-3d4f-472b-bf43-d0d3a6560ccf");

            migrationBuilder.DeleteData(
                table: "balances",
                keyColumn: "id",
                keyValue: "cf945d28-948a-46fd-8b13-9930ab0005d2");

            migrationBuilder.DeleteData(
                table: "balances",
                keyColumn: "id",
                keyValue: "d5e4ea01-292f-466b-8402-716c59ee5e3f");

            migrationBuilder.DeleteData(
                table: "developers_and_publishers",
                keyColumn: "id",
                keyValue: "969ff063-ae4d-4c47-a1c7-f6a8dde2895a");

            migrationBuilder.DeleteData(
                table: "users",
                keyColumn: "id",
                keyValue: "2afc2366-1846-49b3-aaf6-b29458755e97");

            migrationBuilder.DeleteData(
                table: "users",
                keyColumn: "id",
                keyValue: "4f9afe94-0f58-4e28-9eab-3aba49af52e0");

            migrationBuilder.DeleteData(
                table: "users",
                keyColumn: "id",
                keyValue: "d2ddfc6e-5c8e-4632-a7c0-7009a293f324");

            migrationBuilder.InsertData(
                table: "developers_and_publishers",
                columns: new[] { "id", "country_id", "created_by", "description", "founded_date", "is_approved", "logo_url", "modified_by", "name", "website" },
                values: new object[] { "14797ced-77c7-457c-91d6-da214ffa97ba", 231, null, "DeveloperAndPublisher description", new DateTime(2025, 8, 24, 17, 53, 57, 962, DateTimeKind.Utc).AddTicks(4701), true, null, null, "DeveloperAndPublisher", null });

            migrationBuilder.InsertData(
                table: "users",
                columns: new[] { "id", "avatar_url", "bio", "country_id", "created_by", "email", "email_confirmed", "external_provider", "external_provider_key", "level", "modified_by", "nickname", "password_hash", "role_id" },
                values: new object[,]
                {
                    { "5c0d6c29-f4fb-45fc-bba9-5ae14da286c0", null, null, 231, null, "admin@mail.com", true, null, null, 0, null, "Admin", "7D64D8B0B76B23625CA2804E54F2B9F9562EE3175AD21AB02ACB9AE80E80C970-C8DCFB0B66B8BA472A481750248172C3", "admin" },
                    { "e2397ea1-6d88-4d11-88f4-951b57ef65e2", null, null, 231, null, "manager@mail.com", true, null, null, 0, null, "Manager", "7D64D8B0B76B23625CA2804E54F2B9F9562EE3175AD21AB02ACB9AE80E80C970-C8DCFB0B66B8BA472A481750248172C3", "manager" },
                    { "fd46d035-183c-45ea-8315-30ec9a200061", null, null, 231, null, "user@mail.com", true, null, null, 0, null, "User", "7D64D8B0B76B23625CA2804E54F2B9F9562EE3175AD21AB02ACB9AE80E80C970-C8DCFB0B66B8BA472A481750248172C3", "user" }
                });

            migrationBuilder.InsertData(
                table: "balances",
                columns: new[] { "id", "amount", "user_id" },
                values: new object[,]
                {
                    { "22c0fe80-d253-4aa9-ab8f-8b41ad350bd9", 100m, "e2397ea1-6d88-4d11-88f4-951b57ef65e2" },
                    { "561d6d73-d03b-4616-84d6-8dc4d7a080fd", 100m, "fd46d035-183c-45ea-8315-30ec9a200061" },
                    { "c784dc40-3048-4e2c-8efa-78f454aef4d8", 100m, "5c0d6c29-f4fb-45fc-bba9-5ae14da286c0" }
                });
        }
    }
}
