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
      
      // 1. Always show at the very top
      if (currentScrollY < 10) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      // 2. Smart Collapse: Hide on scroll down, Show on scroll up
      if (currentScrollY > lastScrollY.current + 5) {
        setIsVisible(false); // Hide
      } else if (currentScrollY < lastScrollY.current - 5) {
        setIsVisible(true); // Show
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
    } else {
      toast.error('নোটিফিকেশন অনুমতি প্রয়োজন');
    }
  };

  return (
    <>
      {/* 1. THE FIXED HEADER */}
      <header 
        className={`fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-sm border-b-4 border-red-600 z-50 transition-transform duration-300 ease-in-out ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Logo Section */}
            <Link 
              href="/" 
              className="flex items-center gap-2 md:gap-3 group hover:opacity-90 transition-opacity"
            >
              <div className="relative">
                {/* Responsive Icon Size */}
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center text-white shadow-md group-hover:shadow-lg group-hover:rotate-3 transition-all duration-300">
                  <Shield className="w-5 h-5 md:w-7 md:h-7" />
                </div>
                {/* Active Pulse Dot */}
                <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              
              <div className="flex flex-col">
                <h1 className="text-xl md:text-2xl font-black bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent leading-none md:mb-1">
                  SattyoAlert
                </h1>
                <p className="text-[10px] md:text-xs text-gray-500 font-bold flex items-center gap-1 leading-none">
                  <span className="text-lg leading-none">🇧🇩</span> সত্য Alert
                </p>
              </div>
            </Link>
            
            {/* Right Side Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              
              {/* Enable Alerts Button (Responsive) */}
              <button 
                onClick={handleEnableAlerts}
                className="group relative flex items-center gap-2 px-3 py-2 md:px-5 md:py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-md hover:shadow-xl active:scale-95"
              >
                <Bell className="w-4 h-4 md:w-5 md:h-5 group-hover:animate-swing" />
                
                {/* Text Hidden on very small screens, visible on bigger mobile & desktop */}
                <span className="hidden xs:inline text-xs md:text-sm font-bold">
                  Alerts
                </span>
                
                {/* Desktop Full Text */}
                <span className="hidden md:inline text-sm font-bold">
                   On
                </span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Animated Progress Bar */}
        <div className="h-1 bg-gradient-to-r from-red-500 via-green-500 to-red-500 animate-gradient w-full"></div>
      </header>

      {/* 2. THE SPACER (Matches Header Height Exactly) */}
      {/* Mobile: h-16 (header content) + 4px (border) + 4px (progress bar) ≈ 72px 
          Desktop: h-20 (80px) + 4px + 4px ≈ 88px
      */}
      <div className="h-[72px] md:h-[88px] w-full bg-transparent"></div>
    </>
  );
}