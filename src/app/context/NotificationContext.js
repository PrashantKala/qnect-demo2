"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = crypto.randomUUID();
    const newNotification = {
      id,
      type: 'info',
      duration: 5000,
      ...notification,
    };

    setNotifications((prev) => [...prev, newNotification]);

    // Auto-remove notification after duration
    if (newNotification.duration) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  const showSuccess = useCallback(
    (title, message, duration = 5000) => {
      return addNotification({
        type: 'success',
        title,
        message,
        duration,
      });
    },
    [addNotification]
  );

  const showError = useCallback(
    (title, message, duration = 5000) => {
      return addNotification({
        type: 'error',
        title,
        message,
        duration,
      });
    },
    [addNotification]
  );

  const showInfo = useCallback(
    (title, message, duration = 5000) => {
      return addNotification({
        type: 'info',
        title,
        message,
        duration,
      });
    },
    [addNotification]
  );

  const showWarning = useCallback(
    (title, message, duration = 5000) => {
      return addNotification({
        type: 'warning',
        title,
        message,
        duration,
      });
    },
    [addNotification]
  );

  const contextValue = useMemo(() => ({
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  }), [notifications, addNotification, removeNotification, showSuccess, showError, showInfo, showWarning]);

  return (
    <NotificationContext.Provider
      value={contextValue}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};
