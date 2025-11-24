// src/lib/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyB6XN0QorfhQv7QgQtKU-msxww-WA3ieiY",
  authDomain: "sattyoalert-4f72c.firebaseapp.com",
  projectId: "sattyoalert-4f72c",
  storageBucket: "sattyoalert-4f72c.firebasestorage.app",
  messagingSenderId: "131710688606",
  appId: "1:131710688606:web:1ab0239a705e6f52ef43cf"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

let messaging = null;
let messagingInitialized = false;

// Function to safely get messaging instance
async function getMessagingInstance() {
  if (typeof window === 'undefined') {
    return null;
  }

  if (messaging) {
    return messaging;
  }

  try {
    const supported = await isSupported();
    if (supported && !messagingInitialized) {
      messaging = getMessaging(app);
      messagingInitialized = true;
      return messaging;
    }
  } catch (err) {
    console.log('Messaging not supported:', err);
  }
  
  return null;
}

export { messaging };

export async function requestNotificationPermission() {
  try {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      console.log('Notifications not supported in this browser');
      return null;
    }

    // Check if service worker is supported
    if (!('serviceWorker' in navigator)) {
      console.log('Service workers not supported');
      return null;
    }

    const supported = await isSupported();
    if (!supported) {
      console.log('FCM not supported in this browser');
      return null;
    }

    const permission = await Notification.requestPermission();
    
    if (permission !== 'granted') {
      console.log('Notification permission denied');
      return null;
    }

    // Get messaging instance
    const messagingInstance = await getMessagingInstance();
    if (!messagingInstance) {
      console.log('Could not initialize messaging');
      return null;
    }

    // Wait for service worker to be ready
    try {
      await navigator.serviceWorker.ready;
      console.log('Service worker is ready');
    } catch (error) {
      console.error('Service worker not ready:', error);
      return null;
    }

    // Get FCM token
    const token = await getToken(messagingInstance, {
      vapidKey: 'BHkBPMUaQ0YxjW8cqMpRQ_4_4SFQccYbEDcS9yItqQtHV03KPLTNkNPx5Wo4WMkpdS_WP5Kuv1tQ7EdSNsQPiPo'
    });
    
    if (token) {
      console.log('FCM Token obtained:', token);
      return token;
    } else {
      console.log('No token received');
      return null;
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return null;
  }
}

export async function onMessageListener() {
  const messagingInstance = await getMessagingInstance();
  
  if (!messagingInstance) {
    console.log('Messaging not available for listener');
    return null;
  }

  return new Promise((resolve) => {
    onMessage(messagingInstance, (payload) => {
      console.log('Message received:', payload);
      resolve(payload);
    });
  });
}

export default app;