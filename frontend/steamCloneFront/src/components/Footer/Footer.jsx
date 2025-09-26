import React from "react";
import "./Footer.scss";
import toThePageStart from "../../assets/To-the-page-start.svg";

const ToThePageStart = ({ className }) => {
  return (
    <div
      className={`to-the-page-start ${className}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <img src={toThePageStart} alt="arrow up" className="footer-arrow" />
    </div>
  );
};

export const Footer = ({
  frame = "https://c.animaapp.com/tpw3XJzh/img/frame-5264.svg",
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
          <ToThePageStart className="page-start-button" />
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
