import React from "react";
import "./GameCoverImage.scss";

const GameCoverImage = ({ handleFileChange, coverImagePreview, handleUpdate }) => {
  return (
    <div className="game-form-container flux-border" style={{ width: "70%" }}>
      <div className="game-cover-image">
        <div className="header-with-action">
          <h3>Game Cover Image</h3>
          <button className="game-save-image" onClick={handleUpdate}>Save</button>
        </div>
        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/gif"
          onChange={handleFileChange}
        />
        {coverImagePreview ? (
          <div className="cover-image-preview">
            <h4>Cover Image Preview</h4>
            <img
              src={coverImagePreview}
              alt="Cover Preview"
            />
          </div>
        ) : (
          <p>No cover image selected</p>
        )}
      </div>
    </div>
  );
};

export default GameCoverImage;
