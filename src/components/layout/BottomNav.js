'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation'; // Import this hook
import { Home, FileText, Palette, BarChart3, FileCheck } from 'lucide-react';

function BottomNav() {
  const pathname = usePathname(); // Get the current URL path
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 1. Hide immediately when scrolling down
      if (currentScrollY > lastScrollY.current + 10 && currentScrollY > 50) {
        setIsVisible(false);
      } 
      // 2. Show immediately if scrolling up
      else if (currentScrollY < lastScrollY.current - 10) {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;

      // 3. "Come back when I stop scrolling" logic
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
      }, 600);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const navItems = [
    { 
      href: '/', 
      icon: Home,
      label: 'হোম',
      // Check if current path matches href
      active: pathname === '/' 
    },
    { 
      href: '/report', 
      icon: FileText,
      label: 'রিপোর্ট',
      active: pathname === '/report'
    },
    { 
      href: '/generate', 
      icon: Palette,
      label: 'গ্রাফিক্স',
      active: pathname === '/generate'
    },
    { 
      href: '/summary', 
      icon: BarChart3,
      label: 'সারসংক্ষেপ',
      active: pathname === '/summary'
    },
    { 
      href: '/terms', 
      icon: FileCheck,
      label: 'শর্তাবলী',
      active: pathname === '/terms'
    },
  ];

  return (
    <nav 
      className={`fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-2xl z-50 transition-transform duration-500 ease-in-out ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto px-2">
        <div className="flex justify-around items-center py-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`relative flex flex-col items-center gap-1 px-3 py-2.5 rounded-2xl transition-all duration-300 ${
                  item.active
                    ? 'text-red-600 scale-105'
                    : 'text-gray-500 hover:text-red-600 hover:bg-gray-50'
                }`}
              >
                {item.active && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-red-600 to-red-700 rounded-full shadow-lg"></div>
                )}
                
                <div className={`relative p-2 rounded-xl transition-all duration-300 ${
                  item.active 
                    ? 'bg-gradient-to-br from-red-50 to-red-100' 
                    : 'bg-transparent'
                }`}>
                  <Icon className={`w-5 h-5 transition-all duration-300 ${
                    item.active ? 'scale-110' : ''
                  }`} />
                  
                  {item.href === '/report' && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></div>
                  )}
                </div>
                
                <span className={`text-xs font-semibold transition-all duration-300 ${
                  item.active ? 'scale-105' : ''
                }`}>
                  {item.label}
                </span>
              </a>
            );
          })}
        </div>
      </div>
      
      {/* Safe area padding for newer iPhones */}
      <div className="h-2 bg-white/50"></div>
    </nav>
  );
}

export default BottomNav;