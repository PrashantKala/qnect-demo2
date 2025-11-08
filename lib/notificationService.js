/**
 * Browser push notification service for Qnect website
 * Handles browser notification requests and FCM token registration
 */

/**
 * Check if browser supports notifications
 */
export function isNotificationSupported() {
  if (typeof window === 'undefined') return false;
  return 'Notification' in window;
}

/**
 * Check if service workers are supported
 */
export function isServiceWorkerSupported() {
  if (typeof window === 'undefined') return false;
  return 'serviceWorker' in navigator;
}

/**
 * Request notification permission from user
 */
export async function requestNotificationPermission() {
  if (!isNotificationSupported()) {
    console.warn('Notifications not supported in this browser');
    return false;
  }

  if (Notification.permission === 'granted') {
    console.log('Notification permission already granted');
    return true;
  }

  if (Notification.permission !== 'denied') {
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  return false;
}

/**
 * Send a local browser notification
 */
export function sendLocalNotification(title, options = {}) {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    console.warn('Cannot send notification - permission denied or not supported');
    return null;
  }

  try {
    const notification = new Notification(title, {
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      ...options,
    });

    return notification;
  } catch (error) {
    console.error('Error sending notification:', error);
    return null;
  }
}

/**
 * Send incoming call notification
 */
export function sendCallNotification(callerName, qrId) {
  return sendLocalNotification(`Incoming call from ${callerName}`, {
    body: 'Click to answer the call',
    tag: 'incoming-call',
    requireInteraction: true,
    actions: [
      {
        action: 'answer',
        title: 'Answer',
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
      },
    ],
    data: {
      type: 'call',
      qrId: qrId,
    },
  });
}

/**
 * Send message notification
 */
export function sendMessageNotification(senderName, messagePreview) {
  return sendLocalNotification(`Message from ${senderName}`, {
    body: messagePreview,
    tag: 'new-message',
    requireInteraction: false,
  });
}

/**
 * Send QR scan notification
 */
export function sendQRScanNotification(scannerName) {
  return sendLocalNotification(`QR Code scanned by ${scannerName}`, {
    body: 'Someone scanned your QR code',
    tag: 'qr-scan',
    requireInteraction: false,
  });
}

/**
 * Register service worker and set up push notifications
 * This should be called on app initialization
 */
export async function setupPushNotifications() {
  if (!isServiceWorkerSupported()) {
    console.log('Service Workers not supported');
    return null;
  }

  try {
    // Register service worker (create sw.js in public folder)
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker registered:', registration);

    // Listen for push notifications
    if (registration.active) {
      registration.active.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'PUSH_NOTIFICATION') {
          console.log('Push notification received:', event.data);
          handlePushNotification(event.data);
        }
      });
    }

    return registration;
  } catch (error) {
    console.error('Error setting up push notifications:', error);
    return null;
  }
}

/**
 * Handle incoming push notification
 */
function handlePushNotification(data) {
  const { type, callerName, qrId, senderName, messageText } = data;

  switch (type) {
    case 'incoming_call':
      sendCallNotification(callerName, qrId);
      break;

    case 'new_message':
      sendMessageNotification(senderName, messageText);
      break;

    case 'qr_scan':
      sendQRScanNotification(data.scannerName);
      break;

    default:
      console.log('Unknown push notification type:', type);
  }
}

/**
 * Get stored FCM token from localStorage
 */
export function getStoredFCMToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('qnect_fcm_token');
}

/**
 * Save FCM token to localStorage
 */
export function saveFCMToken(token) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('qnect_fcm_token', token);
}

/**
 * Clear FCM token from localStorage
 */
export function clearFCMToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('qnect_fcm_token');
}
