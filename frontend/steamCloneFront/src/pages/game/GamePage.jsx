import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SvgComponentMainPanel } from "./components/SvgComponentMainPanel";
import "../../App.scss";
import "./gamePage.scss";
import { useGetGameByIdQuery } from "../../services/game/gameApi";
import {
  useGetIsInWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from "../../services/wishlist/wishlistApi";

export const GamePage = () => {
  const { gameId } = useParams();

  const { data: gameData, isLoading } = useGetGameByIdQuery(gameId);
  const { data: isInWishlistData, isLoading: isLoadingWishlist } =
    useGetIsInWishlistQuery(gameId);

  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  // Стан для кастомної стрічкової каруселі скріншотів
  const [screenshotIndex, setScreenshotIndex] = useState(0);
  const visibleCount = 2; // Скільки зображень видно повністю/частково (1 центр + 1 частково)

  if (isLoading && isLoadingWishlist) {
    return <div>Loading...</div>;
  }

  if (!gameData) {
    return <div>Game not found</div>;
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

  console.log("Current Game:", gameById);

  return (
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
            src={gameById.coverImageUrl}
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
              <div className="rainbow-button-text">
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
            <div className="screenshots-title-and-buttons">
              <h3 className="h3-with-bottom-border">Screenshots</h3>
              <div className="screenshot-buttons">
                <button
                  className="screenshots-left-button"
                  onClick={() =>
                    setScreenshotIndex((prev) => Math.max(prev - 1, 0))
                  }
                  disabled={screenshotIndex === 0}
                />
                <button
                  className="screenshots-buttons"
                  onClick={() =>
                    setScreenshotIndex((prev) =>
                      Math.min(prev + 1, gameById.screenshotUrls.length - 1)
                    )
                  }
                  disabled={
                    screenshotIndex === gameById.screenshotUrls.length - 1
                  }
                />
              </div>
            </div>
            <div className="screenshots-carousel">
              {gameById.screenshotUrls.length > 0 ? (
                <div className="carousel-track-wrapper">
                  <div
                    className="carousel-track"
                    style={{
                      transform: `translateX(-${
                        screenshotIndex * (100 / visibleCount)
                      }%)`,
                    }}
                  >
                    {gameById.screenshotUrls.map((screenshot, idx) => (
                      <div
                        className={`carousel-slide${
                          idx === screenshotIndex ? " active" : ""
                        }`}
                        key={idx}
                      >
                        <img
                          src={screenshot}
                          alt={`Screenshot ${idx + 1}`}
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <span>No screenshots available</span>
              )}
            </div>
            <div
              style={{
                textAlign: "center",
                marginTop: "8px",
                color: "#aaa",
                fontSize: "0.95em",
              }}
            >
              {gameById.screenshotUrls.length > 0 && (
                <span>
                  {screenshotIndex + 1} / {gameById.screenshotUrls.length}
                </span>
              )}
            </div>
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
                <button className="rainbow-button">
                  <div className="rainbow-button-text">Purchase</div>
                </button>
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
                        <li>Processor: {recommendedRequirements.processor}</li>
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
  );
};
