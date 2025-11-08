// Service Worker for handling web push notifications
// Place this file in public/sw.js

self.addEventListener('push', function(event) {
  console.log('Push notification received:', event);

  if (!event.data) {
    console.log('No data in push event');
    return;
  }

  let notificationData = {};

  try {
    notificationData = event.data.json();
  } catch (e) {
    console.log('Could not parse push notification data as JSON');
    notificationData = {
      title: event.data.text(),
      icon: '/icon-192x192.png',
    };
  }

  const options = {
    icon: notificationData.notification?.icon || '/icon-192x192.png',
    badge: '/badge-72x72.png',
    tag: notificationData.data?.type || 'notification',
    requireInteraction: notificationData.data?.type === 'incoming_call',
    data: notificationData.data || {},
    ...notificationData.notification,
  };

  event.waitUntil(
    self.registration.showNotification(
      notificationData.notification?.title || 'QNect Notification',
      options
    )
  );
});

// Handle notification click
self.addEventListener('notificationclick', function(event) {
  console.log('Notification clicked:', event);
  event.notification.close();

  const data = event.notification.data;
  let url = '/';

  if (data.type === 'incoming_call' && data.url) {
    url = data.url;
  } else if (data.type === 'new_message') {
    url = data.url || '/profile';
  } else if (data.type === 'qr_scan') {
    url = data.url || '/profile';
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window with the target URL
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }

      // If not, open a new window
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Handle notification close
self.addEventListener('notificationclose', function(event) {
  console.log('Notification closed:', event.notification.data);
});
