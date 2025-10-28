// Notification.jsx - Toast notification component

import { useEffect } from 'react';

const Notification = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    // Auto-close after 3 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const typeStyles = {
    success: {
      backgroundColor: '#10b981',
      icon: '✓',
    },
    error: {
      backgroundColor: '#ef4444',
      icon: '✕',
    },
    info: {
      backgroundColor: '#3b82f6',
      icon: 'ℹ',
    },
  };

  const style = typeStyles[type] || typeStyles.success;

  return (
    <div
      className="notification"
      style={{ backgroundColor: style.backgroundColor }}
      onClick={onClose}
    >
      <span className="notification-icon">{style.icon}</span>
      <span className="notification-message">{message}</span>
      <button className="notification-close" onClick={onClose}>
        ×
      </button>
    </div>
  );
};

export default Notification;

