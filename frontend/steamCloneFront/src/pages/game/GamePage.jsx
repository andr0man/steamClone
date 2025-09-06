import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ConfirmModal } from "../../components/ConfirmModal";
import "../../styles/App.scss";
import {
  useGetGameByIdQuery,
  useBuyGameMutation,
} from "../../services/game/gameApi";
import {
  useAddToWishlistMutation,
  useGetIsInWishlistQuery,
  useRemoveFromWishlistMutation,
} from "../../services/wishlist/wishlistApi";
import { SvgComponentMainPanel } from "./components/SvgComponentMainPanel";
import "./gamePage.scss";
import { useGetIsInGameLibraryQuery } from "../../services/game-library/gameLibraryApi";
import { ImageCarousel } from "./components/ImageCarousel";

export const GamePage = () => {
  const { gameId } = useParams();

  const { data: gameData, isLoading } = useGetGameByIdQuery(gameId);
  const { data: isInWishlistData, isLoading: isLoadingWishlist } =
    useGetIsInWishlistQuery(gameId);
  const {
    data: isInLibraryData,
    isLoading: isLoadingLibrary,
    refetch: refetchIsInLibrary,
  } = useGetIsInGameLibraryQuery(gameId);

  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [buyGame, result] = useBuyGameMutation();

  // Стан для модального вікна підтвердження купівлі
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading && isLoadingWishlist && isLoadingLibrary) {
    return <div className="loading-overlay visible">Loading data...</div>;
  }

  if (!gameData || !isInWishlistData || !isInLibraryData) {
    return <h1 style={{display: "flex", justifyContent: "center", alignContent: "center", height: "100vh"}}>Game not found</h1>;
  }

  const gameById = gameData.payload;

  const minimumRequirements = Array.isArray(gameById.systemRequirements)
    ? gameById.systemRequirements.find(
        (req) => req.requirementType === "Minimum" && req.platform === "Windows"
      )
    : null;
  const recommendedRequirements = Array.isArray(gameById.systemRequirements)
    ? gameById.systemRequirements.find(
        (req) =>
          req.requirementType === "Recommended" && req.platform === "Windows"
      )
    : null;

  const handleBuyingGame = async (gameId) => {
    try {
      await buyGame(gameId).unwrap();
      setIsModalOpen(false);
      await refetchIsInLibrary();
      toast.success("Thank you for your purchase!");
    } catch (err) {
      const message =
        err?.data?.message ||
        err?.message ||
        "Purchase failed. Please try again.";
      toast.error(message);
    }
  };

  return (
    <>
      <div className="game-page">
        <div className="flux-border game-main-panel">
          <div className="game-main-content">
            <SvgComponentMainPanel rotate={false} />

            <div className="game-main-content-left">
              {gameById.genres.length !== 0 ? (
                gameById.genres.map((genre) => (
                  <span
                    key={genre.id}
                    id={genre.id}
                    className="rgb-border-for-text"
                  >
                    {genre.name}
                  </span>
                ))
              ) : (
                <span className="rgb-border-for-text">No genres available</span>
              )}
            </div>

            <SvgComponentMainPanel rotate={true} />
          </div>
          <div className="game-main-content">
            <img
              src={gameById.coverImageUrl ?? "/common/gameNoImage.png"}
              alt="Game Cover"
              className="rgb-border"
              loading="lazy"
            />
            <div className="game-main-content-center">
              <h1>{gameById.name}</h1>
              <div className="game-release-info">
                <span>
                  Publisher:{" "}
                  <a href={gameById.publisher.website}>
                    {gameById.publisher.name}
                  </a>
                </span>
                <span>
                  Developer:{" "}
                  <a href={gameById.developer.website}>
                    {gameById.developer.name}
                  </a>
                </span>
                <span>
                  Release Date:{" "}
                  {new Date(gameById.releaseDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="game-main-content">
            <SvgComponentMainPanel rotate={false} />

            <div className="game-description">{gameById.description}</div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <button
                className={
                  isInWishlistData.payload ? "white-button" : "rainbow-button"
                }
                onClick={() => {
                  if (isInWishlistData.payload) {
                    removeFromWishlist(gameId);
                  } else {
                    addToWishlist(gameId);
                  }
                }}
              >
                <div>
                  {isInWishlistData.payload
                    ? "Remove from wishlist"
                    : "Add to wishlist"}
                </div>
              </button>
            </div>
          </div>
        </div>
        <div className="game-bottom-panels">
          <div className="game-bottom-left-panel">
            <div className="game-screenshots-panel flux-border">
              <ImageCarousel
                title="Screenshots"
                images={gameById.screenshotUrls}
              />
            </div>
            {/* <div className="special-editions flux-border">123</div>
                      <div className="about-game flux-border">123</div> */}
          </div>
          <div className="game-bottom-right-panel">
            <div className="buy-game-panel flux-border">
              <h3>Buy Game</h3>
              <div className="buy-game-button-section">
                <span>{gameById.price}₴</span>
                <div>
                  {isInLibraryData.payload ? (
                    <div className="white-outline-for-text" disabled>
                      <div>In your Library</div>
                    </div>
                  ) : (
                    <button
                      className="rainbow-button"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <div>Purchase</div>
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="system-requirements flux-border">
              <h3 className="h3-with-bottom-border">System Requirements</h3>
              <div className="system-requirements-content">
                <div className="minimum-requirements">
                  <span>Minimum:</span>
                  <ul>
                    {minimumRequirements ? (
                      <>
                        {minimumRequirements.os ? (
                          <li>OS: {minimumRequirements.os}</li>
                        ) : null}
                        {minimumRequirements.processor ? (
                          <li>Processor: {minimumRequirements.processor}</li>
                        ) : null}
                        {minimumRequirements.memory ? (
                          <li>Memory: {minimumRequirements.memory}</li>
                        ) : null}
                        {minimumRequirements.graphics ? (
                          <li>Graphics: {minimumRequirements.graphics}</li>
                        ) : null}
                        {minimumRequirements.directX ? (
                          <li>DirectX: {minimumRequirements.directX}</li>
                        ) : null}
                        {minimumRequirements.network ? (
                          <li>Network: {minimumRequirements.network}</li>
                        ) : null}
                        {minimumRequirements.storage ? (
                          <li>Storage: {minimumRequirements.storage}</li>
                        ) : null}
                      </>
                    ) : (
                      <span>No minimum requirements found</span>
                    )}
                  </ul>
                </div>
                <div className="recommended-requirements">
                  <span>Recommended:</span>
                  <ul>
                    {recommendedRequirements ? (
                      <>
                        {recommendedRequirements.os ? (
                          <li>OS: {recommendedRequirements.os}</li>
                        ) : null}
                        {recommendedRequirements.processor ? (
                          <li>
                            Processor: {recommendedRequirements.processor}
                          </li>
                        ) : null}
                        {recommendedRequirements.memory ? (
                          <li>Memory: {recommendedRequirements.memory}</li>
                        ) : null}
                        {recommendedRequirements.graphics ? (
                          <li>Graphics: {recommendedRequirements.graphics}</li>
                        ) : null}
                        {recommendedRequirements.directX ? (
                          <li>DirectX: {recommendedRequirements.directX}</li>
                        ) : null}
                        {recommendedRequirements.network ? (
                          <li>Network: {recommendedRequirements.network}</li>
                        ) : null}
                        {recommendedRequirements.storage ? (
                          <li>Storage: {recommendedRequirements.storage}</li>
                        ) : null}
                      </>
                    ) : (
                      <span>No recommended requirements found</span>
                    )}
                  </ul>
                </div>
              </div>
            </div>
            {/* <div className="age-req flux-border">123</div> */}
          </div>
        </div>
      </div>
      <ConfirmModal
        title="Confirm Purchase"
        description={
          <>
            Are you sure you want to purchase <b>{gameById.name}</b> for{" "}
            <b>{gameById.price}₴</b>?
          </>
        }
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          handleBuyingGame(gameById.id);
        }}
      />
    </>
  );
};
