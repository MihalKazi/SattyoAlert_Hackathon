'use client';

import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function NotificationListener() {
  useEffect(() => {
    // Listen for browser notifications even when page is open
    if ('Notification' in window && Notification.permission === 'granted') {
      
      // Create a custom event listener for demo notifications
      const handleCustomNotification = (event) => {
        const { title, body } = event.detail;
        
        // Show toast notification in the app
        toast(
          <div className="flex items-start gap-3">
            <div className="text-2xl">🔔</div>
            <div>
              <strong className="block text-base mb-1 text-gray-900">{title}</strong>
              <p className="text-sm text-gray-700">{body}</p>
            </div>
          </div>,
          { 
            duration: 6000,
            style: {
              minWidth: '300px',
              background: '#fff',
              color: '#111',
              border: '2px solid #DC2626',
              boxShadow: '0 10px 25px rgba(220, 38, 38, 0.2)',
            },
            icon: '🔔',
          }
        );
      };

      // Listen for custom notification events (same tab)
      window.addEventListener('sattyoalert-notification', handleCustomNotification);

      // Listen for BroadcastChannel (other tabs)
      let channel;
      try {
        channel = new BroadcastChannel('sattyoalert-notifications');
        channel.onmessage = (event) => {
          const { title, body } = event.data;
          toast(
            <div className="flex items-start gap-3">
              <div className="text-2xl">🔔</div>
              <div>
                <strong className="block text-base mb-1 text-gray-900">{title}</strong>
                <p className="text-sm text-gray-700">{body}</p>
              </div>
            </div>,
            { 
              duration: 6000,
              style: {
                minWidth: '300px',
                background: '#fff',
                color: '#111',
                border: '2px solid #DC2626',
                boxShadow: '0 10px 25px rgba(220, 38, 38, 0.2)',
              },
              icon: '🔔',
            }
          );
        };
      } catch (e) {
        // BroadcastChannel not supported
      }

      return () => {
        window.removeEventListener('sattyoalert-notification', handleCustomNotification);
        if (channel) {
          channel.close();
        }
      };
    }
  }, []);

  return null; // This component doesn't render anything
}