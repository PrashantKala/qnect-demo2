"use client";

import React from 'react';
import NotificationToast from './NotificationToast';
import { useNotification } from '../context/NotificationContext';

export default function NotificationToastContainer() {
  const { notifications, removeNotification } = useNotification();

  return (
    <NotificationToast
      notifications={notifications}
      removeNotification={removeNotification}
    />
  );
}
