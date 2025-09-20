// GameCard.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MyGameCard.scss";
import { ConfirmModal } from "../../../../../components/Modals/ConfirmModal";
import {
  useDeleteGameMutation,
  useIsGameBoughtQuery,
  useGetIsOwnerQuery,
} from "../../../../../services/game/gameApi";
import { toast } from "react-toastify";

const MyGameCard = ({ game, user }) => {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteGame] = useDeleteGameMutation();
  const { data: { payload: isBought } = {} } = useIsGameBoughtQuery(game.id);
  const { data: { payload: isOwner } = {}, isLoading: isOwnerLoading, refetch: refetchIsOwner } =
    useGetIsOwnerQuery(game.id);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleDeleteGame = async (gameId) => {
    try {
      await deleteGame(gameId).unwrap();
      setDeleteModalOpen(false);
      toast.success("Game deleted successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete game");
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    refetchIsOwner();
  }, [user]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  return (
    <>
      <div className="game-card-dashboard flux-border">
        <div
          className={`game-status ${
            isOwner ? "full-access" : "partial-access"
          }`}
        >
          {isOwnerLoading
            ? "Loading..."
            : isOwner
            ? game.createdBy === user.id
              ? "Creator"
              : "Full access"
            : "Partial access"}
        </div>
        <div className="game-card-dropdown-wrap">
          <button
            className="game-card-dropdown-btn"
            onClick={() => setDropdownOpen((v) => !v)}
            aria-label="More actions"
          >
            <span className="game-card-dots">Settings</span>
          </button>
          {dropdownOpen && (
            <div className="game-card-dropdown-menu" ref={dropdownRef}>
              <div
                className="game-card-dropdown-section"
                onClick={() => {
                  setDropdownOpen(false);
                  navigate(`items/${game.id}`);
                }}
              >
                Item manage
              </div>
              {isOwner && (
                <div
                  className="game-card-dropdown-section"
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate(`associated-users/${game.id}`);
                  }}
                >
                  Manage access
                </div>
              )}
            </div>
          )}
        </div>
        <div className="game-card-img-wrap">
          <img
            src={game.coverImageUrl ?? "/common/gameNoImage.png"}
            alt={game.name}
            className="game-card-img"
          />
        </div>
        <div className="game-card-content">
          <h3 className="game-card-title">{game.name}</h3>
          <div className="game-card-genres">
            {(game.genres?.length > 3
              ? game.genres.slice(0, 3)
              : game.genres
            )?.map((g) => (
              <span key={g.id} className="game-card-genre">
                {g.name}
              </span>
            ))}
            {game.genres?.length > 3 && (
              <span className="game-card-genre">...</span>
            )}
          </div>
          <div className="game-card-desc">{game.description}</div>
          <div className="game-card-bottom">
            <span className="game-card-price">{game.price}₴</span>
            <button
              className="edit-game-btn"
              onClick={() => navigate(`edit/${game.id}`)}
            >
              Edit
            </button>
            <button
              className="delete-game-btn"
              onClick={() => setDeleteModalOpen(true)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => handleDeleteGame(game.id)}
        title="Delete Game"
        description={
          <>
            Are you sure you want to delete <b>{game.name}</b> game?
            {isBought && (
              <p style={{ color: "red", marginTop: "8px" }}>
                <b>Warning:</b> This game has been purchased by users. Deleting
                it may affect their libraries.
              </p>
            )}
          </>
        }
      />
    </>
  );
};

export default MyGameCard;
