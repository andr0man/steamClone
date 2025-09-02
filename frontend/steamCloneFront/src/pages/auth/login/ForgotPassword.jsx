import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/auth.scss';
import './ForgotPassword.scss';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [seconds, setSeconds] = useState(60);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      alert('Please enter your email.');
      return;
    }
    setOpenModal(true);
    setSeconds(60);
  };

  useEffect(() => {
    if (!openModal || seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [openModal, seconds]);

  const handleResend = () => {
    if (seconds > 0) return;
    setSeconds(60);
  };

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpenModal(false);
    if (openModal) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openModal]);

  return (
    <div className="flux-auth-container">
      <div className="flux-auth-box">
        <div className="flux-header">
          <h2>Forgot Password</h2>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="flux-form-group">
            <div className="flux-input-wrapper">
              <input
                type="email"
                id="forgot-email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email address"
                autoComplete="email"
              />
            </div>
          </div>

          <button
            type="submit"
            className="flux-continue-button"
            aria-label="Send reset link"
          ></button>
        </form>

        <div className="flux-switch-form">
          Remembered your password?
          <Link to="/login" className="flux-link"> Back to Login</Link>
        </div>
      </div>

      {openModal && (
        <div
          className="flux-modal-overlay modal-enter"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpenModal(false)}
        >
          <div
            className="flux-modal-content reset-sent-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="flux-modal-close"
              aria-label="Close modal"
              onClick={() => setOpenModal(false)}
              type="button"
              title="Close"
            >
              ×
            </button>

            <h3>Password Reset Sent</h3>

            <p>
              A secure recovery link has been dispatched to your email.
              Please check your inbox (and spam folder) to begin restoring
              access to your Flux account.
            </p>

            <p className="flux-reset-hint">
              Didn’t get the message? You can request a new link in
              <span className="flux-countdown"> {seconds}</span> seconds.
            </p>

            <button
              type="button"
              className="flux-request-link-button"
              onClick={handleResend}
              disabled={seconds > 0}
              aria-label="Request a new link"
              title={seconds > 0 ? `Wait ${seconds}s` : 'Request a new link'}
            >
              Request a new link
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;