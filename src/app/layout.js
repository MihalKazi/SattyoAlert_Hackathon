'use client';

import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import NotificationPrompt from '@/components/notifications/NotificationPrompt';
import { registerServiceWorker } from './register-sw';
import './globals.css';

export default function RootLayout({ children }) {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <html lang="bn">
      <head>
        <title>SattyoAlert - সত্যAlert</title>
        <meta name="description" content="নির্বাচনে সত্যের পাহারাদার" />
      </head>
      <body>
        {children}
        
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              fontFamily: 'Hind Siliguri, sans-serif',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#DC2626',
                secondary: '#fff',
              },
            },
          }}
        />

        <NotificationPrompt />
      </body>
    </html>
  );
}