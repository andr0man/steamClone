import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ConfirmModal } from "../../../../../components/Modals/ConfirmModal";
import {
  useApproveMutation,
  useGetGameByIdQuery,
} from "../../../../../services/game/gameApi";
import { useGetAllLanguagesQuery } from "../../../../../services/language/languageApi";
import { useGetUserByIdQuery } from "../../../../../services/user/userApi";
import "../../../../../styles/App.scss";
import { ImageCarousel } from "../../../../game/components/ImageCarousel";
import { SvgComponentMainPanel } from "../../../../game/components/SvgComponentMainPanel";
import "../../../../game/gamePage.scss";
import checkMark from "/game-page/checkmark.svg";

const GamePreviewForApprove = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const { data: { payload: gameById } = {}, isLoading } =
    useGetGameByIdQuery(gameId);
  const {
    data: { payload: languages } = { payload: [] },
    isLoading: languagesLoading,
  } = useGetAllLanguagesQuery();

  const [approveGame] = useApproveMutation();

  const [isApproveModalOpen, setApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setRejectModalOpen] = useState(false);

  const handleApprove = () => {
    try {
      approveGame({ id: gameById.id, isApproved: true }).unwrap();
      setApproveModalOpen(false);
      toast.success("Game approved successfully");
      navigate(-1);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to approve game");
    }
  };

  const handleReject = () => {
    try {
      debugger;
      approveGame({ id: gameById.id, isApproved: false }).unwrap();
      setRejectModalOpen(false);
      toast.success("Game rejected successfully");
      navigate(-1);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to reject game");
    }
  };

  const { data: { payload: user } = {} } = useGetUserByIdQuery(
    gameById?.createdBy
  );

  if (isLoading && languagesLoading) {
    return <div className="loading-overlay visible">Loading data...</div>;
  }

  if (!gameById) {
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

  const localizationsSorted = Array.isArray(gameById.localizations)
    ? [...gameById.localizations].sort((a, b) => {
        const aCount = [a.fullAudio, a.interface, a.subtitles].filter(
          Boolean
        ).length;
        const bCount = [b.fullAudio, b.interface, b.subtitles].filter(
          Boolean
        ).length;
        return bCount - aCount;
      })
    : [];

  const renderSystemRequirements = (title, form) => (
    <>
      <span>{title}:</span>
      <ul>
        {form ? (
          <>
            {form.os ? (
              <li>
                <strong>OS:</strong> {form.os}
              </li>
            ) : null}
            {form.processor ? (
              <li>
                <strong>Processor:</strong> {form.processor}
              </li>
            ) : null}
            {form.memory ? (
              <li>
                <strong>Memory:</strong> {form.memory}
              </li>
            ) : null}
            {form.graphics ? (
              <li>
                <strong>Graphics:</strong> {form.graphics}
              </li>
            ) : null}
            {form.directX ? (
              <li>
                <strong>DirectX:</strong> {form.directX}
              </li>
            ) : null}
            {form.network ? (
              <li>
                <strong>Network:</strong> {form.network}
              </li>
            ) : null}
            {form.storage ? (
              <li>
                <strong>Storage:</strong> {form.storage}
              </li>
            ) : null}
          </>
        ) : (
          <span>No requirements specified</span>
        )}
      </ul>
    </>
  );

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
            <div className="game-page-cover-image">
              <img
                src={gameById.coverImageUrl ?? "/common/gameNoImage.png"}
                alt="Game Cover"
              />
            </div>
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
                className="rainbow-button"
                onClick={() => {
                  setApproveModalOpen(true);
                }}
              >
                <div>Approve</div>
              </button>
              <button
                className="white-button"
                onClick={() => {
                  setRejectModalOpen(true);
                }}
              >
                <div>Reject</div>
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
          </div>
          <div className="game-bottom-right-panel">
            <div className="system-requirements flux-border">
              <h3 className="h3-with-bottom-border">System Requirements</h3>
              <div className="system-requirements-content">
                <div className="minimum-requirements">
                  {renderSystemRequirements("Minimum", minimumRequirements)}
                </div>
                <div className="recommended-requirements">
                  {renderSystemRequirements(
                    "Recommended",
                    recommendedRequirements
                  )}
                </div>
              </div>
            </div>
            <div
              className="game-page-localizations flux-border"
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <h3 className="h3-with-bottom-border">Game Localizations</h3>
              {localizationsSorted.length !== 0 ? (
                <div className="localizations-list">
                  <div className="thead">
                    <div className="tr">
                      <div className="th"></div>
                      <div className="th">Interface</div>
                      <div className="th">Full audio</div>
                      <div className="th">Subtitles</div>
                    </div>
                  </div>
                  {localizationsSorted.map((loc) => (
                    <div className="tr" key={loc.id}>
                      <div className="td lang-name">
                        {
                          languages.find((lang) => lang.id === loc.languageId)
                            ?.name
                        }
                      </div>
                      <div className="td">
                        {loc.interface ? <img src={checkMark} alt="Yes" /> : ""}
                      </div>
                      <div className="td">
                        {loc.fullAudio ? <img src={checkMark} alt="Yes" /> : ""}
                      </div>
                      <div className="td">
                        {loc.subtitles ? <img src={checkMark} alt="Yes" /> : ""}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <span>No localizations specified</span>
              )}
            </div>
          </div>
        </div>
      </div>
      <ConfirmModal
        title={"Approve Game"}
        description={
          <>
            Are you sure you want to approve the game{" "}
            <strong>{gameById.name}</strong> by <strong>{user?.email}</strong>?
          </>
        }
        isOpen={isApproveModalOpen}
        onClose={() => setApproveModalOpen(false)}
        onConfirm={handleApprove}
      />
      <ConfirmModal
        title={"Reject Game"}
        description={
          <>
            Are you sure you want to reject the game{" "}
            <strong>{gameById.name}</strong> by <strong>{user?.email}</strong>?
          </>
        }
        isOpen={isRejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onConfirm={handleReject}
      />
    </>
  );
};

export default GamePreviewForApprove;
