using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SteamClone.DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddedGames : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "games",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    price = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    release_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    cover_image_url = table.Column<string>(type: "text", nullable: true),
                    screenshot_urls = table.Column<List<string>>(type: "text[]", nullable: false),
                    created_by = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    modified_by = table.Column<string>(type: "text", nullable: true),
                    modified_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_games", x => x.id);
                    table.ForeignKey(
                        name: "fk_games_users_created_by",
                        column: x => x.created_by,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_games_users_modified_by",
                        column: x => x.modified_by,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "game_genre",
                columns: table => new
                {
                    game_id = table.Column<string>(type: "text", nullable: false),
                    genres_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_game_genre", x => new { x.game_id, x.genres_id });
                    table.ForeignKey(
                        name: "fk_game_genre_games_game_id",
                        column: x => x.game_id,
                        principalTable: "games",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_game_genre_genres_genres_id",
                        column: x => x.genres_id,
                        principalTable: "genres",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "system_requirements",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    os = table.Column<string>(type: "text", nullable: true),
                    requirement_type = table.Column<string>(type: "text", nullable: false),
                    platform = table.Column<string>(type: "text", nullable: false),
                    processor = table.Column<string>(type: "text", nullable: true),
                    memory = table.Column<string>(type: "text", nullable: true),
                    graphics = table.Column<string>(type: "text", nullable: true),
                    direct_x = table.Column<string>(type: "text", nullable: true),
                    storage = table.Column<string>(type: "text", nullable: true),
                    network = table.Column<string>(type: "text", nullable: true),
                    game_id = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_system_requirements", x => x.id);
                    table.ForeignKey(
                        name: "fk_system_requirements_games_game_id",
                        column: x => x.game_id,
                        principalTable: "games",
                        principalColumn: "id");
                });

            migrationBuilder.CreateIndex(
                name: "ix_genres_created_by",
                table: "genres",
                column: "created_by");

            migrationBuilder.CreateIndex(
                name: "ix_genres_modified_by",
                table: "genres",
                column: "modified_by");

            migrationBuilder.CreateIndex(
                name: "ix_game_genre_genres_id",
                table: "game_genre",
                column: "genres_id");

            migrationBuilder.CreateIndex(
                name: "ix_games_created_by",
                table: "games",
                column: "created_by");

            migrationBuilder.CreateIndex(
                name: "ix_games_modified_by",
                table: "games",
                column: "modified_by");

            migrationBuilder.CreateIndex(
                name: "ix_system_requirements_game_id",
                table: "system_requirements",
                column: "game_id");

            migrationBuilder.AddForeignKey(
                name: "fk_genres_users_created_by",
                table: "genres",
                column: "created_by",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_genres_users_modified_by",
                table: "genres",
                column: "modified_by",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_genres_users_created_by",
                table: "genres");

            migrationBuilder.DropForeignKey(
                name: "fk_genres_users_modified_by",
                table: "genres");

            migrationBuilder.DropTable(
                name: "game_genre");

            migrationBuilder.DropTable(
                name: "system_requirements");

            migrationBuilder.DropTable(
                name: "games");

            migrationBuilder.DropIndex(
                name: "ix_genres_created_by",
                table: "genres");

            migrationBuilder.DropIndex(
                name: "ix_genres_modified_by",
                table: "genres");
        }
    }
}
