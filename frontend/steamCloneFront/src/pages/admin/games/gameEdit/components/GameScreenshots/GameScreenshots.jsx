import React, { useState } from "react";
import "./GameScreenshots.scss";

const GameScreenshots = ({
  game,
  handleFileChange,
  markImageForDeletion,
  imagesToDelete,
  handleUpdate
}) => {
  var visibleScreenshots = game.screenshotUrls.filter(
    (img) => !imagesToDelete.includes(img)
  );
  return (
    <div className="game-form-container flux-border">
      <div className="game-screenshots">
        <div className="header-with-action">
          <h3>Game Screenshots</h3>
          <button className="game-save-image" onClick={handleUpdate}>Save</button>
        </div>
        <input
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
