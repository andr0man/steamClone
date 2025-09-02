import React, { useEffect, useState } from 'react';
import './Notification.css';

const ICONS = {
  info: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
    </svg>
  ),
  success: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2zm-1.1 14.2l-3.6-3.6 1.4-1.4 2.2 2.2 4.7-4.7 1.4 1.4-6.1 6.1z" />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2zm3.5 12.1l-1.4 1.4L12 13.4l-2.1 2.1-1.4-1.4 2.1-2.1-2.1-2.1 1.4-1.4 2.1 2.1 2.1-2.1 1.4 1.4-2.1 2.1 2.1 2.1z" />
    </svg>
  ),
};

const Notification = ({
  message,
  type = 'info',        // 'info' | 'success' | 'warning' | 'error'
  duration = 4000,
  onClose,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) {
      setVisible(false);
      return;
    }
    setVisible(true);
    const timer = setTimeout(() => closeNow(), duration);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message, duration]);

  useEffect(() => {
    if (!visible) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeNow();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const closeNow = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  if (!visible) return null;

  const role = type === 'error' || type === 'warning' ? 'alert' : 'status';
  const live = type === 'error' || type === 'warning' ? 'assertive' : 'polite';

  const icon = ICONS[type] || ICONS.info;

  return (
    <div
      className={`notification notification-${type} ${visible ? 'notification-visible' : ''}`}
      role={role}
      aria-live={live}
    >
      <span className="notification-icon" aria-hidden="true">
        {icon}
      </span>
      <p className="notification-text">{message}</p>
      <button
        onClick={closeNow}
        className="notification-close-btn"
        aria-label="Close notification"
        title="Close"
      >
        ×
      </button>
    </div>
  );
};

export default Notification;