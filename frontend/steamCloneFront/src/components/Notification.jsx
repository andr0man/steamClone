// src/components/Notification.jsx
import React, { useEffect, useState } from 'react';
import './Notification.css'; // Стилі для повідомлення

const Notification = ({ message, type = 'error', duration = 5000, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [message, duration, onClose]);

  if (!visible) {
    return null;
  }

  return (
    <div className={`notification notification-${type} ${visible ? 'notification-visible' : ''}`}>
      <p>{message}</p>
      <button onClick={() => { setVisible(false); if (onClose) onClose(); }} className="notification-close-btn">&times;</button>
    </div>
  );
};

export default Notification;