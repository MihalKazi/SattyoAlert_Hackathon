'use client';

import { Inter, Hind_Siliguri } from "next/font/google"; // 1. Import Fonts
import { Toaster } from 'react-hot-toast';
import NotificationPrompt from '@/components/notifications/NotificationPrompt';
import NotificationListener from '@/components/notifications/NotificationListener';
import './globals.css';

// 2. Configure Fonts
const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const hindSiliguri = Hind_Siliguri({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['bengali'],
  variable: '--font-bengali'
});

export default function RootLayout({ children }) {
  return (
    <html lang="bn" className={`${inter.variable} ${hindSiliguri.variable}`}>
      <head>
        <title>SattyoAlert - সত্যAlert</title>
        <meta name="description" content="নির্বাচনে সত্যের পাহারাদার" />
        {/* Next.js automatically detects the src/app/icon.js file for the favicon */}
      </head>
      
      <body className="bg-slate-50 font-sans" suppressHydrationWarning>
        {children}
        
        {/* Updated Toaster with Premium Styling */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937', // Slate-800 (Darker/Premium)
              color: '#fff',
              fontFamily: 'var(--font-bengali), sans-serif',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981', // Emerald-500
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#DC2626', // Red-600
                secondary: '#fff',
              },
            },
          }}
        />

        <NotificationPrompt />
        <NotificationListener />
      </body>
    </html>
  );
}