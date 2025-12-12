'use client';

import { LayoutGrid, Vote, Church, DollarSign, Heart } from 'lucide-react';

export default function CategoryFilter({ currentCategory, onCategoryChange }) {
  const categories = [
    { id: 'all', label: 'সব', icon: LayoutGrid, color: 'from-purple-500 to-purple-600', shadow: 'shadow-purple-200' },
    { id: 'election', label: 'নির্বাচন', icon: Vote, color: 'from-red-500 to-red-600', shadow: 'shadow-red-200' },
    { id: 'religious', label: 'ধর্মীয়', icon: Church, color: 'from-orange-500 to-orange-600', shadow: 'shadow-orange-200' },
    { id: 'scam', label: 'স্ক্যাম', icon: DollarSign, color: 'from-blue-500 to-blue-600', shadow: 'shadow-blue-200' },
    { id: 'health', label: 'স্বাস্থ্য', icon: Heart, color: 'from-green-500 to-green-600', shadow: 'shadow-green-200' }
  ];

  return (
    // 1. SMART LAYOUT: Horizontal scroll on Mobile, Wrapped Center on Desktop
    <div className="flex gap-3 overflow-x-auto md:flex-wrap md:justify-center pb-4 md:pb-0 mb-6 px-1 no-scrollbar snap-x">
      
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isActive = currentCategory === cat.id;
        
        return (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            // 2. STYLE: flex-shrink-0 prevents buttons from squishing on mobile
            className={`group relative flex-shrink-0 snap-center px-5 py-2.5 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 border ${
              isActive
                ? `bg-gradient-to-r ${cat.color} text-white shadow-lg ${cat.shadow} scale-105 border-transparent`
                : 'bg-white text-slate-600 border-slate-200 hover:border-red-200 hover:bg-red-50 hover:text-red-700'
            }`}
          >
            {/* Icon Container */}
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 ${
              isActive 
                ? 'bg-white/20' 
                : 'bg-slate-100 group-hover:bg-white'
            }`}>
              <Icon className={`w-4 h-4 transition-colors ${
                isActive ? 'text-white' : 'text-slate-500 group-hover:text-red-600'
              }`} />
            </div>
            
            {/* Label */}
            <span className="text-sm whitespace-nowrap">{cat.label}</span>
            
            {/* Active Indicator Dot */}
            {isActive && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}