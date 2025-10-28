// NotificationContainer.jsx - Container for managing notifications

import { useState, useCallback } from 'react';
import Notification from './Notification';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback((message, type = 'success') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const showSuccess = useCallback((message) => {
    return showNotification(message, 'success');
  }, [showNotification]);

  const showError = useCallback((message) => {
    return showNotification(message, 'error');
  }, [showNotification]);

  const showInfo = useCallback((message) => {
    return showNotification(message, 'info');
  }, [showNotification]);

  return {
    notifications,
    showNotification,
    showSuccess,
    showError,
    showInfo,
    removeNotification,
  };
};

export const NotificationContainer = ({ notifications, onRemove }) => {
  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          onClose={() => onRemove(notification.id)}
        />
      ))}
    </div>
  );
};

