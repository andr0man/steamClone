import React, { useRef } from "react";
import "./MyGameCoverImage.scss";

const MyGameCoverImage = ({
  handleFileChange,
  coverImagePreview,
  handleUpdate,
  coverImageFile,
  cancelCoverImageChange,
}) => {
  const inputRef = useRef();

  const handleCancel = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    cancelCoverImageChange();
  };

  return (
    <div className="game-form-container flux-border" style={{ width: "40%" }}>
      <div className="game-cover-image">
        <div className="header-with-action">
          <h3>Game Cover Image</h3>
          <div style={{ gap: "10px", display: "flex" }}>
            {coverImageFile && (
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
          onChange={handleFileChange}
        />
        {coverImagePreview ? (
          <div className="cover-image-preview">
            <h4>
              {coverImageFile ? "Cover Image Preview" : "Current Cover Image"}
            </h4>
            <img src={coverImagePreview} alt="Cover Preview" />
          </div>
        ) : (
          <p>No cover image selected</p>
        )}
      </div>
    </div>
  );
};

export default MyGameCoverImage;
