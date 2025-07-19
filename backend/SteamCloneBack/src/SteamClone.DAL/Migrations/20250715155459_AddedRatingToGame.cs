using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SteamClone.DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddedRatingToGame : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "percentage_of_positive_reviews",
                table: "games",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "percentage_of_positive_reviews",
                table: "games");
        }
    }
}
