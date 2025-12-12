'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation'; 
import { Home, FileText, Palette, BarChart3, FileCheck } from 'lucide-react'; // Added FileCheck for Terms
import Link from 'next/link';

function BottomNav() {
  const pathname = usePathname(); 
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 1. Hide when scrolling down
      if (currentScrollY > lastScrollY.current + 10 && currentScrollY > 50) {
        setIsVisible(false);
      } 
      // 2. Show when scrolling up
      else if (currentScrollY < lastScrollY.current - 10) {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;

      // 3. Auto-show after stopping scroll
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
      }, 600);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '/', icon: Home, label: 'হোম' },
    { href: '/summary', icon: BarChart3, label: 'সারসংক্ষেপ' },
    { href: '/report', icon: FileText, label: 'রিপোর্ট' },
    { href: '/generate', icon: Palette, label: 'গ্রাফিক্স' },
    { href: '/terms', icon: FileCheck, label: 'শর্তাবলী' }, // <--- ADDED BACK
  ];

  return (
    <div 
      className={`fixed left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ease-in-out ${
        isVisible ? 'bottom-6 opacity-100 translate-y-0' : '-bottom-24 opacity-0 translate-y-10'
      }`}
    >
      {/* Light Glassmorphism Container */}
      <nav className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] px-3 py-2 flex items-center gap-1 sm:gap-2">
        
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center gap-1 min-w-[60px] p-2 rounded-2xl transition-all duration-300 group ${
                isActive ? 'bg-red-50' : 'hover:bg-gray-100'
              }`}
            >
              <Icon className={`w-5 h-5 transition-all duration-300 ${
                isActive ? 'text-red-600 stroke-2.5 scale-110' : 'text-slate-500 group-hover:text-slate-700 stroke-2'
              }`} />
              
              <span className={`text-[10px] font-bold tracking-wide transition-colors ${
                isActive ? 'text-red-600' : 'text-slate-400 group-hover:text-slate-600'
              }`}>
                {item.label}
              </span>

              {isActive && (
                 <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-600 rounded-full"></span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default BottomNav;