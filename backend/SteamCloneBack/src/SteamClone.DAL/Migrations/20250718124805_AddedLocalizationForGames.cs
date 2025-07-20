using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SteamClone.DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddedLocalizationForGames : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "localizations",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    @interface = table.Column<bool>(name: "interface", type: "boolean", nullable: false),
                    full_audio = table.Column<bool>(type: "boolean", nullable: false),
                    subtitles = table.Column<bool>(type: "boolean", nullable: false),
                    game_id = table.Column<string>(type: "text", nullable: false),
                    language_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_localizations", x => x.id);
                    table.ForeignKey(
                        name: "fk_localizations_games_game_id",
                        column: x => x.game_id,
                        principalTable: "games",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_localizations_languages_language_id",
                        column: x => x.language_id,
                        principalTable: "languages",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_localizations_game_id",
                table: "localizations",
                column: "game_id");

            migrationBuilder.CreateIndex(
                name: "ix_localizations_language_id",
                table: "localizations",
                column: "language_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "localizations");
        }
    }
}
