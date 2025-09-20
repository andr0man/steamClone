import { useNavigate } from "react-router-dom";
import { useByAssociatedUserQuery } from "../../../services/game/gameApi";
import "./ManageMyGames.scss";
import MyGameCard from "./components/game-card/MyGameCard";
import { useEffect, useState } from "react";
import { useGetProfileQuery } from "../../../services/user/userApi";
import { useSearchFilter } from "../../../components/Search/useSearchFilter";

const ManageMyGames = () => {
  const navigate = useNavigate();

  const { data: { payload: user } = {}, isLoading: isUserLoading } =
    useGetProfileQuery();

  const {
    data: { payload: approvedGames } = { payload: [] },
    isLoading: isApprovedLoading,
    refetch: refetchApprovedGames,
  } = useByAssociatedUserQuery(true);
  const {
    data: { payload: pendingGames } = { payload: [] },
    isLoading: isPendingLoading,
    refetch: refetchPendingGames,
  } = useByAssociatedUserQuery(null);
  const {
    data: { payload: rejectedGames } = { payload: [] },
    isLoading: isRejectedLoading,
    refetch: refetchRejectedGames,
  } = useByAssociatedUserQuery(false);

  useEffect(() => {
    refetchApprovedGames();
    refetchPendingGames();
    refetchRejectedGames();
  }, []);

  const [activeTab, setActiveTab] = useState("approved");

  const tabConfig = [
    { key: "approved", label: "Approved", count: approvedGames.length },
    { key: "pending", label: "Pending", count: pendingGames.length },
    { key: "rejected", label: "Rejected", count: rejectedGames.length },
  ];

  let gamesToShow = [];
  if (activeTab === "approved") gamesToShow = approvedGames;
  else if (activeTab === "pending") gamesToShow = pendingGames;
  else if (activeTab === "rejected") gamesToShow = rejectedGames;

  const {
    query,
    filteredList: filteredGames,
    handleSearch,
  } = useSearchFilter(gamesToShow, (item, query) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  if (
    isApprovedLoading ||
    isPendingLoading ||
    isRejectedLoading ||
    isUserLoading
  ) {
    return <div className="loading-overlay visible">Loading data...</div>;
  }

  return (
    <div className="manage-my-games-container">
      <div className="header-with-action">
        <h2>Manage My Games</h2>
        <div className="tabs">
          {tabConfig.map((tab) => (
            <button
              key={tab.key}
              className={`tab-btn${activeTab === tab.key ? " active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
        <div>
          <button
            className="create-game-btn"
            onClick={() => navigate("create")}
          >
            Create New Game
          </button>
        </div>
      </div>
      <div className="search-bar-games">
        <input
          type="text"
          placeholder={`Search ${activeTab} game by name...`}
          onChange={handleSearch}
          value={query}
        />
      </div>

      <div className="games-grid">
        {filteredGames.length > 0 ? (
          filteredGames.map((game) => (
            <MyGameCard key={game.id} game={game} user={user} />
          ))
        ) : (
          <div>No games available</div>
        )}
      </div>
    </div>
  );
};

export default ManageMyGames;
