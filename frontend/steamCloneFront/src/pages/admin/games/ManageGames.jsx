import React from "react";
import { useGetAllGamesQuery } from "../../../services/game/gameApi";
import GameCard from "./components/gameCard/GameCard";
import "./components/gameCard/GameCard.scss";
import "../../../styles/App.scss";
import "./ManageGames.scss";
import { Link, useNavigate } from "react-router-dom";

const ManageGames = () => {
  const navigate = useNavigate();
  const { data: gamesResponse, isLoading, error } = useGetAllGamesQuery();
  const games = gamesResponse?.payload;

  if (isLoading) return <div className="loading-overlay visible">Loading data...</div>;
  if (error) return <div>Error loading games</div>;

  // game response
  // "id": "610c8eab-9db0-42a4-963c-3273e44395c7",
  // "name": "game 4",
  // "description": "string",
  // "genres": [
  //   {
  //     "id": 1,
  //     "name": "Action",
  //     "description": ""
  //   }
  // ],
  // "price": 10,
  // "releaseDate": "2025-08-26T08:41:33.809Z",
  // "coverImageUrl": "http://localhost:5104/images/game_covers/05fab72e-62e3-44cb-be7b-5ef2c82a4a9b.png",
  // "screenshotUrls": [
  //   "http://localhost:5104/images/game_screenshots/7cbaa330-f6e1-45b5-8ad2-07fe7a18f76d.png",
  //   "http://localhost:5104/images/game_screenshots/acfb98cc-f570-4816-8f00-8522a313192b.png",
  //   "http://localhost:5104/images/game_screenshots/5437eb40-c80a-4d00-b9c8-99001698fcc3.png",
  //   "http://localhost:5104/images/game_screenshots/a49b2da5-e98b-4b50-987b-8a8e367c256c.png",
  //   "http://localhost:5104/images/game_screenshots/68f3d7ca-25a0-497a-b701-8961e9255a15.png",
  //   "http://localhost:5104/images/game_screenshots/4d6651fc-5af7-4653-a998-c62c990eac9b.png",
  //   "http://localhost:5104/images/game_screenshots/3041825f-1fb9-4353-ab8f-8bf58d56f436.png"
  // ],
  // "developerId": "969ff063-ae4d-4c47-a1c7-f6a8dde2895a",
  // "publisherId": "969ff063-ae4d-4c47-a1c7-f6a8dde2895a",
  // "percentageOfPositiveReviews": null,
  // "systemRequirements": [],
  // "localizations": [],
  // "publisher": null,
  // "developer": null

  return (
    <div
      className="manage-games-container"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2 style={{ marginBottom: 24 }}>Manage Games</h2>
        <button onClick={() => navigate("/admin/games/create")} className="create-game-btn">
          Create New Game
        </button>
      </div>

      <div className="games-grid">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
};

export default ManageGames;
