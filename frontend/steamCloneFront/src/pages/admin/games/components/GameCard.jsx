// GameCard.jsx
import { useNavigate } from "react-router-dom";
import "./GameCard.scss";
import { ConfirmModal } from "../../../../components/ConfirmModal";
import { useDeleteGameMutation } from "../../../../services/game/gameApi";
import { toast } from "react-toastify";
import { useState } from "react";

const GameCard = ({ game }) => {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteGame] = useDeleteGameMutation();

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
return (
    <>
        <div className="game-card">
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
                    {game.genres?.length > 4 && (
                        <span className="game-card-genre">...</span>
                    )}
                </div>
                <div className="game-card-desc">{game.description}</div>
                <div className="game-card-bottom">
                    <span className="game-card-price">{game.price}₴</span>
                    <button
                        className="edit-game-btn"
                        onClick={() => navigate(`/admin/games/edit/${game.id}`)}
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
                </>
            }
        />
    </>
);
};

export default GameCard;
