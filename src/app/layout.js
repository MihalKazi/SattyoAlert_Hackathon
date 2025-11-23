// src/app/layout.js
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata = {
  title: 'SattyoAlert - সত্যAlert',
  description: 'নির্বাচনে সত্যের পাহারাদার',
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
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
      </body>
    </html>
  );
}