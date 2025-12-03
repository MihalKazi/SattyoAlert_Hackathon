'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, FileText, Palette, BarChart3 } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { 
      href: '/', 
      icon: Home,
      label: 'হোম',
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
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t-2 border-gray-200 shadow-2xl z-50">
      <div className="max-w-7xl mx-auto px-2">
        <div className="flex justify-around items-center py-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex flex-col items-center gap-1 px-4 py-2.5 rounded-2xl transition-all duration-300 ${
                  item.active
                    ? 'text-red-600 scale-105'
                    : 'text-gray-500 hover:text-red-600 hover:bg-gray-50'
                }`}
              >
                {/* Active Indicator */}
                {item.active && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-red-600 to-red-700 rounded-full shadow-lg"></div>
                )}
                
                {/* Icon with background */}
                <div className={`relative p-2 rounded-xl transition-all duration-300 ${
                  item.active 
                    ? 'bg-gradient-to-br from-red-50 to-red-100' 
                    : 'bg-transparent'
                }`}>
                  <Icon className={`w-5 h-5 transition-all duration-300 ${
                    item.active ? 'scale-110' : ''
                  }`} />
                  
                  {/* Notification Badge (optional) */}
                  {item.href === '/report' && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></div>
                  )}
                </div>
                
                {/* Label */}
                <span className={`text-xs font-semibold transition-all duration-300 ${
                  item.active ? 'scale-105' : ''
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
      
      {/* Safe area for notched phones */}
      <div className="h-safe-area-inset-bottom bg-white"></div>
    </nav>
  );
}