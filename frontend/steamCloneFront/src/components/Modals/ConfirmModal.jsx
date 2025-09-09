import "./ConfirmModal.scss";

export const ConfirmModal = ({
  title,
  description,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-modal-overlay">
      <div className="modal-with-border-container">
        <div className="modal-border"></div>

        <div className="modal-with-border-content">
          <button
            className="confirm-modal-close-btn"
            onClick={onClose}
            ariaLabel="Close"
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
          <h2>{title}</h2>
          <p>
            {description}
            {/* Are you sure you want to purchase <b>{gameName}</b> for{" "}
            <b>{price}₴</b>? */}
          </p>
          <div className="confirm-modal-actions">
            <button className="white-button" onClick={onClose}>
              <div>Cancel</div>
            </button>
            <button className="rainbow-button" onClick={onConfirm}>
              <div>Confirm</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
