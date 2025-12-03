'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { requestNotificationPermission } from '@/lib/firebase/config';
import { toast } from 'react-hot-toast';
import { Bell, Shield, AlertCircle } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const isAdmin = pathname === '/admin';

  const handleEnableAlerts = async () => {
    const token = await requestNotificationPermission();
    
    if (token) {
      toast.success('🔔 নোটিফিকেশন চালু হয়েছে!');
      console.log('FCM Token:', token);
    } else {
      toast.error('নোটিফিকেশন অনুমতি প্রয়োজন');
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg border-b-4 border-red-600 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link 
            href="/" 
            className="flex items-center gap-3 group hover:scale-105 transition-all duration-300"
          >
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg group-hover:shadow-xl group-hover:rotate-3 transition-all duration-300">
                <Shield className="w-6 h-6" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                SattyoAlert
              </h1>
              <p className="text-xs text-gray-600 font-semibold flex items-center gap-1">
                <span className="text-green-600">🇧🇩</span> সত্য Alert
              </p>
            </div>
          </Link>
          
          <div className="flex items-center gap-2 md:gap-3">
            {/* Admin Link */}
            {!isAdmin && (
              <Link
                href="/admin"
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-300 font-semibold text-sm border-2 border-transparent hover:border-red-200"
              >
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            )}
            
            {/* Enable Alerts Button */}
            <button 
              onClick={handleEnableAlerts}
              className="group relative px-4 py-2 md:px-5 md:py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-semibold text-sm flex items-center gap-2"
            >
              <Bell className="w-4 h-4 group-hover:animate-pulse" />
              <span className="hidden md:inline">Enable Alerts</span>
              <span className="md:hidden">Alerts</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Animated Progress Bar */}
      <div className="h-1 bg-gradient-to-r from-red-600 via-green-600 to-red-600 animate-gradient"></div>
    </header>
  );
}