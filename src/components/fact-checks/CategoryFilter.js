'use client';

import { LayoutGrid, Vote, Church, DollarSign, Heart } from 'lucide-react';

export default function CategoryFilter({ currentCategory, onCategoryChange }) {
  const categories = [
    { id: 'all', label: 'সব', icon: LayoutGrid, color: 'from-purple-500 to-purple-600' },
    { id: 'election', label: 'নির্বাচন', icon: Vote, color: 'from-red-500 to-red-600' },
    { id: 'religious', label: 'ধর্মীয়', icon: Church, color: 'from-orange-500 to-orange-600' },
    { id: 'scam', label: 'স্ক্যাম', icon: DollarSign, color: 'from-blue-500 to-blue-600' },
    { id: 'health', label: 'স্বাস্থ্য', icon: Heart, color: 'from-green-500 to-green-600' }
  ];

  return (
    <div className="flex gap-3 flex-wrap mb-8 justify-center">
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isActive = currentCategory === cat.id;
        
        return (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`group relative px-5 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 border-2 ${
              isActive
                ? `bg-gradient-to-r ${cat.color} text-white shadow-xl scale-105 border-transparent`
                : 'bg-white/90 backdrop-blur-sm text-gray-700 border-white/50 hover:border-red-300 hover:scale-105 hover:shadow-lg'
            }`}
          >
            {/* Icon Container */}
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
              isActive 
                ? 'bg-white/20' 
                : 'bg-gray-100 group-hover:bg-red-50'
            }`}>
              <Icon className={`w-4 h-4 transition-colors ${
                isActive ? 'text-white' : 'text-gray-600 group-hover:text-red-600'
              }`} />
            </div>
            
            {/* Label */}
            <span className="text-sm">{cat.label}</span>
            
            {/* Active Indicator */}
            {isActive && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-white rounded-full shadow-lg"></div>
            )}
          </button>
        );
      })}
    </div>
  );
}