import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ConfirmModal } from "../../components/ConfirmModal";
import "../../styles/App.scss";
import { useGetAllLanguagesQuery } from "../../services/language/languageApi";
import {
  useGetGameByIdQuery,
  useBuyGameMutation,
} from "../../services/game/gameApi";
import checkMark from "/game-page/checkmark.svg";
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
  const {
    data: { payload: languages } = { payload: [] },
    isLoading: languagesLoading,
  } = useGetAllLanguagesQuery();

  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [buyGame, result] = useBuyGameMutation();

  // Стан для модального вікна підтвердження купівлі
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading && isLoadingWishlist && isLoadingLibrary && languagesLoading) {
    return <div className="loading-overlay visible">Loading data...</div>;
  }

  if (!gameData || !isInWishlistData || !isInLibraryData) {
    return (
      <h1
        style={{
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
          height: "100vh",
        }}
      >
        Game not found
      </h1>
    );
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

  const calculateDiscountedPrice = (price, discount) => {
    return (price - (price * discount) / 100).toFixed(0);
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
            <div>
              <SvgComponentMainPanel rotate={false} />
            </div>

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
                {gameById.discount ? (
                  <div className="discount-panel">
                    <div className="discount-badge">-{gameById.discount}%</div>
                    <div className="discount-price">
                      <span className="original-price">{gameById.price}₴</span>
                      <span className="sale-price">
                        {calculateDiscountedPrice(
                          gameById.price,
                          gameById.discount
                        )}
                        ₴
                      </span>
                    </div>
                  </div>
                ) : (
                  <span>
                    <b>{gameById.price}₴</b>
                  </span>
                )}
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
                          <li><strong>OS:</strong> {minimumRequirements.os}</li>
                        ) : null}
                        {minimumRequirements.processor ? (
                          <li><strong>Processor:</strong> {minimumRequirements.processor}</li>
                        ) : null}
                        {minimumRequirements.memory ? (
                          <li><strong>Memory:</strong> {minimumRequirements.memory}</li>
                        ) : null}
                        {minimumRequirements.graphics ? (
                          <li><strong>Graphics:</strong> {minimumRequirements.graphics}</li>
                        ) : null}
                        {minimumRequirements.directX ? (
                          <li><strong>DirectX:</strong> {minimumRequirements.directX}</li>
                        ) : null}
                        {minimumRequirements.network ? (
                          <li><strong>Network:</strong> {minimumRequirements.network}</li>
                        ) : null}
                        {minimumRequirements.storage ? (
                          <li><strong>Storage:</strong> {minimumRequirements.storage}</li>
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
                          <li><strong>OS:</strong> {recommendedRequirements.os}</li>
                        ) : null}
                        {recommendedRequirements.processor ? (
                          <li>
                            <strong>Processor: </strong>{recommendedRequirements.processor}
                          </li>
                        ) : null}
                        {recommendedRequirements.memory ? (
                          <li><strong>Memory: </strong>{recommendedRequirements.memory}</li>
                        ) : null}
                        {recommendedRequirements.graphics ? (
                          <li><strong>Graphics:</strong> {recommendedRequirements.graphics}</li>
                        ) : null}
                        {recommendedRequirements.directX ? (
                          <li><strong>DirectX:</strong> {recommendedRequirements.directX}</li>
                        ) : null}
                        {recommendedRequirements.network ? (
                          <li><strong>Network:</strong> {recommendedRequirements.network}</li>
                        ) : null}
                        {recommendedRequirements.storage ? (
                          <li><strong>Storage:</strong> {recommendedRequirements.storage}</li>
                        ) : null}
                      </>
                    ) : (
                      <span>No recommended requirements found</span>
                    )}
                  </ul>
                </div>
              </div>
            </div>
            <div className="game-page-localizations flux-border">
              {/* <span className="lang-name">{languages.find(lang => lang.id === loc.languageId)?.name}</span> */}
              <h3 className="h3-with-bottom-border">Game Localizations</h3>
              {gameById.localizations.length !== 0 ? (
                <div className="localizations-list">
                  <div className="thead">
                    <div className="tr">
                      <div className="th"></div>
                      <div className="th">Interface</div>
                      <div className="th">Full audio</div>
                      <div className="th">Subtitles</div>
                    </div>
                  </div>
                  {gameById.localizations.map((loc) => (
                    <div className="tr" key={loc.id}>
                      <div className="td lang-name">
                        {languages.find((lang) => lang.id === loc.languageId)?.name}
                      </div>
                      <div className="td">{loc.interface ? <img src={checkMark} alt="Yes" /> : ""}</div>
                      <div className="td">{loc.fullAudio ? <img src={checkMark} alt="Yes" /> : ""}</div>
                      <div className="td">{loc.subtitles ? <img src={checkMark} alt="Yes" /> : ""}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <span>No localizations found</span>
              )}
            </div>
          </div>
        </div>
      </div>
      <ConfirmModal
        title="Confirm Purchase"
        description={
          <>
            Are you sure you want to purchase <b>{gameById.name}</b> for{" "}
            <b>
              {calculateDiscountedPrice(gameById.price, gameById.discount)}₴
            </b>
            ?
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
