using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SteamClone.DAL.Migrations
{
    /// <inheritdoc />
    public partial class FixMigrationForFriendship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_friendships_users_user_id",
                table: "friendships");

            migrationBuilder.DropForeignKey(
                name: "fk_friendships_users_user_id1",
                table: "friendships");

            migrationBuilder.DropIndex(
                name: "ix_friendships_user_id",
                table: "friendships");

            migrationBuilder.DropIndex(
                name: "ix_friendships_user_id1",
                table: "friendships");

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

            migrationBuilder.DropColumn(
                name: "user_id",
                table: "friendships");

            migrationBuilder.DropColumn(
                name: "user_id1",
                table: "friendships");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.AddColumn<string>(
                name: "user_id",
                table: "friendships",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "user_id1",
                table: "friendships",
                type: "text",
                nullable: true);

            migrationBuilder.InsertData(
                table: "developers_and_publishers",
                columns: new[] { "id", "country_id", "created_by", "description", "founded_date", "is_approved", "logo_url", "modified_by", "name", "website" },
                values: new object[] { "f47c669f-64d9-40ba-9af3-fcc69fbb285d", 231, null, "DeveloperAndPublisher description", new DateTime(2025, 8, 19, 16, 21, 13, 345, DateTimeKind.Utc).AddTicks(8555), true, null, null, "DeveloperAndPublisher", null });

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
                name: "ix_friendships_user_id",
                table: "friendships",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_friendships_user_id1",
                table: "friendships",
                column: "user_id1");

            migrationBuilder.AddForeignKey(
                name: "fk_friendships_users_user_id",
                table: "friendships",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "fk_friendships_users_user_id1",
                table: "friendships",
                column: "user_id1",
                principalTable: "users",
                principalColumn: "id");
        }
    }
}
