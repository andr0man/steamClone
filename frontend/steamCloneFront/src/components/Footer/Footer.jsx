import React from "react";
import "./Footer.scss";

const ToThePageStart = ({
  className,
  vector = "https://c.animaapp.com/tpw3XJzh/img/vector-3-1.svg",
}) => {
  return (
    <div className={`to-the-page-start ${className}`}>
      <img
        className="vector-image"
        alt="Vector"
        src={vector}
      />
    </div>
  );
};

export const Footer = ({
  frame = "https://c.animaapp.com/tpw3XJzh/img/frame-5264.svg",
  toThePageStartVector = "https://c.animaapp.com/tpw3XJzh/img/vector-3.svg",
  assetFlux = "https://c.animaapp.com/tpw3XJzh/img/asset-2-flux-1.svg",
}) => {
  return (
    <div className="footer-container">
      <div className="footer-wrapper">
        <img
          className="frame-image"
          alt="Frame"
          src={frame}
        />

        <div className="footer-content">
          <div className="footer-text-section">
            <div className="footer-info">
              <p className="copyright-text">
                © 2025 Flux. All rights reserved. All trademarks are property of
                their respective owners.
              </p>

              <div className="footer-links">
                <div className="footer-link">Privacy Policy</div>
                <div className="footer-link">Flux Subscriber Agreement</div>
                <div className="footer-link">Support</div>
                <div className="footer-link">Cookies</div>
              </div>
            </div>
          </div>

          <ToThePageStart
            className="page-start-button"
            vector={toThePageStartVector}
          />
        </div>

        <img
          className="asset-flux-image"
          alt="Asset flux"
          src={assetFlux}
        />
      </div>
    </div>
  );
};
