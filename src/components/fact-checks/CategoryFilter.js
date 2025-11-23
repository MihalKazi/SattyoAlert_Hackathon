// src/components/fact-checks/CategoryFilter.js
'use client';

export default function CategoryFilter({ currentCategory, onCategoryChange }) {
  const categories = [
    { id: 'all', label: 'সব', icon: '📋' },
    { id: 'election', label: 'নির্বাচন', icon: '🗳️' },
    { id: 'religious', label: 'ধর্মীয়', icon: '🕌' },
    { id: 'scam', label: 'স্ক্যাম', icon: '💰' },
    { id: 'health', label: 'স্বাস্থ্য', icon: '🏥' }
  ];

  return (
    <div className="flex gap-3 flex-wrap mb-8">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onCategoryChange(cat.id)}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            currentCategory === cat.id
              ? 'bg-red-600 text-white shadow-lg'
              : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-red-600'
          }`}
        >
          {cat.icon} {cat.label}
        </button>
      ))}
    </div>
  );
}