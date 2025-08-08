using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SteamClone.DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddedGameItems : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "items",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    image_url = table.Column<string>(type: "text", nullable: true),
                    game_id = table.Column<string>(type: "text", nullable: false),
                    created_by = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "timezone('utc', now())"),
                    modified_by = table.Column<string>(type: "text", nullable: true),
                    modified_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "timezone('utc', now())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_items", x => x.id);
                    table.ForeignKey(
                        name: "fk_items_games_game_id",
                        column: x => x.game_id,
                        principalTable: "games",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_items_users_created_by",
                        column: x => x.created_by,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_items_users_modified_by",
                        column: x => x.modified_by,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "user_items",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    user_id = table.Column<string>(type: "text", nullable: false),
                    item_id = table.Column<string>(type: "text", nullable: false),
                    is_tradable = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_user_items", x => x.id);
                    table.ForeignKey(
                        name: "fk_user_items_items_item_id",
                        column: x => x.item_id,
                        principalTable: "items",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_user_items_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "market_items",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    user_item_id = table.Column<string>(type: "text", nullable: false),
                    price = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    is_sold = table.Column<bool>(type: "boolean", nullable: false),
                    created_by = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "timezone('utc', now())"),
                    modified_by = table.Column<string>(type: "text", nullable: true),
                    modified_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "timezone('utc', now())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_market_items", x => x.id);
                    table.ForeignKey(
                        name: "fk_market_items_user_items_user_item_id",
                        column: x => x.user_item_id,
                        principalTable: "user_items",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_market_items_users_created_by",
                        column: x => x.created_by,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_market_items_users_modified_by",
                        column: x => x.modified_by,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "ix_items_created_by",
                table: "items",
                column: "created_by");

            migrationBuilder.CreateIndex(
                name: "ix_items_game_id",
                table: "items",
                column: "game_id");

            migrationBuilder.CreateIndex(
                name: "ix_items_modified_by",
                table: "items",
                column: "modified_by");

            migrationBuilder.CreateIndex(
                name: "ix_market_items_created_by",
                table: "market_items",
                column: "created_by");

            migrationBuilder.CreateIndex(
                name: "ix_market_items_modified_by",
                table: "market_items",
                column: "modified_by");

            migrationBuilder.CreateIndex(
                name: "ix_market_items_user_item_id",
                table: "market_items",
                column: "user_item_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_user_items_item_id",
                table: "user_items",
                column: "item_id");

            migrationBuilder.CreateIndex(
                name: "ix_user_items_user_id",
                table: "user_items",
                column: "user_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "market_items");

            migrationBuilder.DropTable(
                name: "user_items");

            migrationBuilder.DropTable(
                name: "items");
        }
    }
}
