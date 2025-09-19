import { useRef } from "react";
import "./GameScreenshots.scss";

const GameScreenshots = ({
  game,
  handleFileChange,
  markImageForDeletion,
  imagesToDelete,
  handleUpdate,
  selectedFiles,
  cancelScreenshotsChange
}) => {
  var visibleScreenshots = game.screenshotUrls.filter(
    (img) => !imagesToDelete.includes(img)
  );

  const inputRef = useRef();

  const handleCancel = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    cancelScreenshotsChange();
  };
  return (
    <div className="game-form-container flux-border" style={{ width: "60%" }}>
      <div className="game-screenshots">
        <div className="header-with-action">
          <h3>Game Screenshots</h3>
          <div style={{ gap: "10px", display: "flex" }}>
            {selectedFiles.length > 0 && (
              <button className="cancel-button" onClick={handleCancel}>
                Cancel
              </button>
            )}
            <button className="game-save-image" onClick={handleUpdate}>
              Save
            </button>
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/gif"
          multiple
          onChange={handleFileChange}
        />
        <div className="screenshots-preview">
          {visibleScreenshots.map((img) => (
            <div key={img} className="screenshot">
              <img src={img} alt="Game Screenshot" />
              <button onClick={() => markImageForDeletion(img)}>Delete</button>
            </div>
          ))}
          {visibleScreenshots.length === 0 && <p>No screenshots available</p>}
        </div>
      </div>
    </div>
  );
};

export default GameScreenshots;
