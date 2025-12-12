'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { requestNotificationPermission } from '@/lib/firebase/config';
import { toast } from 'react-hot-toast';
import { Bell, Shield } from 'lucide-react';

export default function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  // --- SCROLL LOGIC ---
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // 1. If at the very top, always show
      if (currentScrollY < 10) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      // 2. Hide when scrolling down, Show when scrolling up
      if (currentScrollY > lastScrollY.current + 5) {
        // Scrolling DOWN -> Hide
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current - 5) {
        // Scrolling UP -> Show
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <>
      {/* 1. THE FIXED HEADER (Moves up/down) */}
      <header 
        className={`fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg border-b-4 border-red-600 z-50 transition-transform duration-300 ease-in-out ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <Link 
              href="/" 
              className="flex items-center gap-3 group hover:scale-105 transition-all duration-300"
            >
              <div className="relative">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg group-hover:shadow-xl group-hover:rotate-3 transition-all duration-300">
                  <Shield className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                  SattyoAlert
                </h1>
                <p className="text-[10px] md:text-xs text-gray-600 font-semibold flex items-center gap-1">
                  <span className="text-green-600">🇧🇩</span> সত্য Alert
                </p>
              </div>
            </Link>
            
            <div className="flex items-center gap-2 md:gap-3">
              {/* Enable Alerts Button */}
              <button 
                onClick={handleEnableAlerts}
                className="group relative px-3 py-2 md:px-5 md:py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-semibold text-xs md:text-sm flex items-center gap-2"
              >
                <Bell className="w-3 h-3 md:w-4 md:h-4 group-hover:animate-pulse" />
                <span className="hidden md:inline">Enable Alerts</span>
                <span className="md:hidden">Alerts</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Animated Progress Bar */}
        <div className="h-1 bg-gradient-to-r from-red-600 via-green-600 to-red-600 animate-gradient"></div>
      </header>

      {/* 2. THE SPACER (Prevents content from being hidden behind the fixed header) */}
      <div className="h-[76px] md:h-[84px] w-full"></div>
    </>
  );
}