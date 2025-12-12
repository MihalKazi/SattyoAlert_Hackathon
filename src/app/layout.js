import { Inter, Hind_Siliguri } from "next/font/google"; 
import { Toaster } from 'react-hot-toast';
import NotificationPrompt from '@/components/notifications/NotificationPrompt';
import NotificationListener from '@/components/notifications/NotificationListener';
import './globals.css';

// 1. Fonts Configuration
const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const hindSiliguri = Hind_Siliguri({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['bengali'],
  variable: '--font-bengali'
});

// 2. METADATA (Controls Link Previews)
export const metadata = {
  title: "SattyoAlert | সত্য জানুন, বিভ্রান্তি এড়ান",
  description: "বাংলাদেশের নির্ভরযোগ্য ফ্যাক্ট-চেকিং প্ল্যাটফর্ম। গুজব, স্ক্যাম এবং ভুল তথ্যের বিরুদ্ধে আমরা সোচ্চার।",
  
  // This controls what people see on Facebook/WhatsApp
  openGraph: {
    title: "SattyoAlert | সত্য জানুন",
    description: "বাংলাদেশের নির্ভরযোগ্য ফ্যাক্ট-চেকিং প্ল্যাটফর্ম। যাচাইকৃত তথ্য জানুন।",
    type: "website",
    locale: "bn_BD",
    siteName: "SattyoAlert",
  },
  icons: {
    icon: '/icon', // Uses your dynamic shield logo
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn" className={`${inter.variable} ${hindSiliguri.variable}`}>
      <body className="bg-slate-50 font-sans" suppressHydrationWarning>
        {children}
        
        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937', 
              color: '#fff',
              fontFamily: 'var(--font-bengali), sans-serif',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            },
            success: {
              duration: 3000,
              iconTheme: { primary: '#10B981', secondary: '#fff' },
            },
            error: {
              duration: 4000,
              iconTheme: { primary: '#DC2626', secondary: '#fff' },
            },
          }}
        />

        {/* Notification Systems */}
        <NotificationPrompt />
        <NotificationListener />
      </body>
    </html>
  );
}