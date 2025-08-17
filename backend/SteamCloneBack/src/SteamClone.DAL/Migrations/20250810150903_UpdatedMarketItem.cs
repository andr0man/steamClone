using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SteamClone.DAL.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedMarketItem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_market_items_user_item_id",
                table: "market_items");

            migrationBuilder.CreateIndex(
                name: "ix_market_items_user_item_id",
                table: "market_items",
                column: "user_item_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_market_items_user_item_id",
                table: "market_items");

            migrationBuilder.CreateIndex(
                name: "ix_market_items_user_item_id",
                table: "market_items",
                column: "user_item_id",
                unique: true);
        }
    }
}
