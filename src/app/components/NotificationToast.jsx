"use client";

import React from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import styles from './NotificationToast.module.css';

const NotificationToast = ({ notifications, removeNotification }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className={styles.icon} />;
      case 'error':
        return <AlertCircle className={styles.icon} />;
      case 'warning':
        return <AlertTriangle className={styles.icon} />;
      case 'info':
      default:
        return <Info className={styles.icon} />;
    }
  };

  return (
    <div className={styles.toastContainer}>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${styles.toast} ${styles[notification.type]}`}
        >
          <div className={styles.content}>
            {getIcon(notification.type)}
            <div className={styles.textContent}>
              {notification.title && (
                <h4 className={styles.title}>{notification.title}</h4>
              )}
              {notification.message && (
                <p className={styles.message}>{notification.message}</p>
              )}
            </div>
          </div>
          <button
            className={styles.closeBtn}
            onClick={() => removeNotification(notification.id)}
            aria-label="Close notification"
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;
