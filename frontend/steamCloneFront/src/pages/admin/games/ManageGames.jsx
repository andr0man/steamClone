import { useNavigate } from "react-router-dom";
import { useSearchFilter } from "../../../components/Search/useSearchFilter";
import { useGetAllGamesQuery } from "../../../services/game/gameApi";
import "../../../styles/App.scss";
import GameCard from "./components/gameCard/GameCard";
import "./components/gameCard/GameCard.scss";
import "./ManageGames.scss";

const ManageGames = () => {
  const navigate = useNavigate();
  const { data: gamesResponse, isLoading, error } = useGetAllGamesQuery();
  const games = gamesResponse?.payload;

  const { query, filteredList: filteredGames, handleSearch } = useSearchFilter(
    games,
    (item, query) => item.name.toLowerCase().includes(query.toLowerCase())
  );

  if (isLoading || !filteredGames) return <div className="loading-overlay visible">Loading data...</div>;
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
          <button className="approve-game-btn" onClick={() => navigate("approve")}>Games to approve</button>
          <button onClick={() => navigate("create")} className="create-game-btn">
            Create New Game
          </button>
        </div>
      </div>
      <div className="search-bar-games">
        <input
          type="text"
          placeholder="Search game items by name..."
          onChange={handleSearch}
          value={query}
        />
      </div>

      <div className="games-grid">
        {filteredGames.length > 0 ? filteredGames.map((game) => (
          <GameCard key={game.id} game={game} />
        )) : <div>No games available</div>}
      </div>
    </div>
  );
};

export default ManageGames;
