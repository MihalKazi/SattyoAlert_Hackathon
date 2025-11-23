'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { 
      href: '/', 
      icon: '🏠', 
      label: 'হোম',
      active: pathname === '/'
    },
    { 
      href: '/report', 
      icon: '📝', 
      label: 'রিপোর্ট',
      active: pathname === '/report'
    },
    { 
      href: '/generate', 
      icon: '🎨', 
      label: 'গ্রাফিক্স',
      active: pathname === '/generate'
    },
    { 
      href: '/summary', 
      icon: '📊', 
      label: 'সারসংক্ষেপ',
      active: pathname === '/summary'
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                item.active
                  ? 'bg-red-50 text-red-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs font-semibold">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}