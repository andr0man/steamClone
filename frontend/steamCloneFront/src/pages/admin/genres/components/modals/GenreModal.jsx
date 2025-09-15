import React, { useState } from "react";
import "./GenreModal.scss";
import "../../../../../styles/App.scss";

export const GenreModal = ({
  isOpen,
  onClose,
  onSubmit,
  titleText = "Genre Modal",
  confirmText = "Confirm",
  setModalReset,
  genre = null,
}) => {
  const [name, setName] = useState(genre?.name ?? "");
  const [description, setDescription] = useState(genre?.description ?? "");

  // Передаємо функцію reset наверх
  React.useEffect(() => {
    if (setModalReset) {
      setModalReset(() => () => {
        setName("");
        setDescription("");
      });
    }
  }, [setModalReset]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name, description, id: genre ? genre.id : undefined });
  };

  return (
    <div className="confirm-modal-overlay">
      <div className="modal-with-border-container">
        <div className="modal-border"></div>
        <div className="modal-with-border-content">
          <button
            className="my-modal-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 54 54"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g filter="url(#filter0_d_2080_726)">
                <path
                  d="M13.5 13.5L40.5 40.5M40.5 13.5L13.5 40.5"
                  stroke="#A178EB"
                  strokeLinecap="round"
                  shapeRendering="crispEdges"
                />
              </g>
              <defs>
                <filter
                  id="filter0_d_2080_726"
                  x="9.8"
                  y="5.8"
                  width="38.4"
                  height="38.4"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset dx="2" dy="-2" />
                  <feGaussianBlur stdDeviation="2.6" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0.631373 0 0 0 0 0.470588 0 0 0 0 0.921569 0 0 0 1 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_2080_726"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_2080_726"
                    result="shape"
                  />
                </filter>
              </defs>
            </svg>
          </button>
          <h2>{titleText}</h2>
          <form onSubmit={handleSubmit} className="create-genre-form">
            <div className="form-group">
              <label htmlFor="genre-name">Name</label>
              <input
                id="genre-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Genre name"
                autoFocus
              />
            </div>
            <div className="form-group">
              <label htmlFor="genre-description">Description</label>
              <textarea
                id="genre-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Genre description (optional)"
                rows={3}
              />
            </div>
            <div className="modal-actions">
              <button type="button" className="white-button" onClick={onClose}>
                <div>Cancel</div>
              </button>
              <button type="submit" className="rainbow-button">
                <div>{confirmText}</div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
