// src/lib/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

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

// Simple browser notification request
export async function requestNotificationPermission() {
  try {
    if (!('Notification' in window)) {
      console.log('Notifications not supported in this browser');
      return null;
    }

    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('Notification permission granted');
      
      // Show a test notification
      new Notification('SattyoAlert সক্রিয়!', {
        body: 'আপনি এখন গুরুত্বপূর্ণ তথ্য যাচাইয়ের আপডেট পাবেন',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
      });
      
      return 'notification-enabled';
    } else {
      console.log('Notification permission denied');
      return null;
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return null;
  }
}

// Send a demo notification
export function sendDemoNotification(title, body) {
  if ('Notification' in window && Notification.permission === 'granted') {
    // Show browser notification
    new Notification(title, {
      body: body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'sattyoalert-demo',
      requireInteraction: false,
    });
    
    // Also broadcast to all open tabs/windows for in-app display
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('sattyoalert-notification', {
        detail: { title, body }
      });
      window.dispatchEvent(event);
      
      // Also use BroadcastChannel to notify other tabs
      try {
        const channel = new BroadcastChannel('sattyoalert-notifications');
        channel.postMessage({ title, body });
      } catch (e) {
        // BroadcastChannel not supported, ignore
      }
    }
    
    return true;
  }
  return false;
}

export default app;