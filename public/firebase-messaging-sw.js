// public/firebase-messaging-sw.js

// Give the service worker access to Firebase Messaging.
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyB6XN0QorfhQv7QgQtKU-msxww-WA3ieiY",
  authDomain: "sattyoalert-4f72c.firebaseapp.com",
  projectId: "sattyoalert-4f72c",
  storageBucket: "sattyoalert-4f72c.firebasestorage.app",
  messagingSenderId: "131710688606",
  appId: "1:131710688606:web:1ab0239a705e6f52ef43cf"
});

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification.title || 'SattyoAlert';
  const notificationOptions = {
    body: payload.notification.body || 'নতুন তথ্য যাচাই',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: 'sattyoalert-notification',
    requireInteraction: false,
    data: payload.data
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  event.notification.close();

  // Open the app when notification is clicked
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});