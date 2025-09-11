import React from "react";
import { useGetAllGamesQuery, useGetWithoutApprovalQuery } from "../../../services/game/gameApi";
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
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="approve-game-btn" onClick={() => navigate("/admin/games/approve")}>Games to approve</button>
          <button onClick={() => navigate("/admin/games/create")} className="create-game-btn">
            Create New Game
          </button>
        </div>
      </div>

      <div className="games-grid">
        {games.length > 0 ? games.map((game) => (
          <GameCard key={game.id} game={game} />
        )) : <div>No games available</div>}
      </div>
    </div>
  );
};

export default ManageGames;
