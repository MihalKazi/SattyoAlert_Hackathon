// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker
// Use your ACTUAL config from your Firebase Console
firebase.initializeApp({
  apiKey: "AIzaSyB6XN0QorfhQv7QgQtKU-msxww-WA3ieiY",
  authDomain: "sattyoalert-4f72c.firebaseapp.com",
  projectId: "sattyoalert-4f72c",
  storageBucket: "sattyoalert-4f72c.firebasestorage.app",
  messagingSenderId: "131710688606",
  appId: "1:131710688606:web:1ab0239a705e6f52ef43cf"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icons/icon128.png' // Ensure this path exists
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});