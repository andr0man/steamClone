using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SteamClone.DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddedMarketItemHistory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "is_sold",
                table: "market_items");

            migrationBuilder.CreateTable(
                name: "market_items_history",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    user_item_id = table.Column<string>(type: "text", nullable: false),
                    price = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    seller_id = table.Column<string>(type: "text", nullable: false),
                    buyer_id = table.Column<string>(type: "text", nullable: false),
                    date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "timezone('utc', now())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_market_items_history", x => x.id);
                    table.ForeignKey(
                        name: "fk_market_items_history_user_items_user_item_id",
                        column: x => x.user_item_id,
                        principalTable: "user_items",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_market_items_history_users_buyer_id",
                        column: x => x.buyer_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_market_items_history_users_seller_id",
                        column: x => x.seller_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "ix_market_items_history_buyer_id",
                table: "market_items_history",
                column: "buyer_id");

            migrationBuilder.CreateIndex(
                name: "ix_market_items_history_seller_id",
                table: "market_items_history",
                column: "seller_id");

            migrationBuilder.CreateIndex(
                name: "ix_market_items_history_user_item_id",
                table: "market_items_history",
                column: "user_item_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "market_items_history");

            migrationBuilder.AddColumn<bool>(
                name: "is_sold",
                table: "market_items",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
