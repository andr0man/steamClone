import React, { useState } from "react";
import "./GameScreenshots.scss";

const GameScreenshots = ({
  game,
  handleFileChange,
  markImageForDeletion,
  imagesToDelete,
}) => {
  var visibleScreenshots = game.screenshotUrls.filter(
    (img) => !imagesToDelete.includes(img)
  );
  return (
    <div className="game-form-container flux-border">
      <div className="game-screenshots">
        <h3>Game Screenshots</h3>
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
