'use client';

import { useState } from 'react';
import Link from 'next/link'; // Added Link for navigation
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import FactCheckCard from '@/components/fact-checks/FactCheckCard';
import CategoryFilter from '@/components/fact-checks/CategoryFilter';
import { factChecks } from '@/data/sampleFactChecks';
import { TrendingUp, AlertTriangle, Shield, Search, X, Palette } from 'lucide-react';

export default function Home() {
  const [currentCategory, setCurrentCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // logic: Filter by Category AND Search Query
  const filteredFactChecks = factChecks.filter(fc => {
    const matchesCategory = currentCategory === 'all' || fc.category === currentCategory;
    
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      fc.claim.toLowerCase().includes(query) || 
      fc.verdict.toLowerCase().includes(query) ||
      fc.source.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  const stats = {
    total: factChecks.length,
    false: factChecks.filter(fc => fc.status === 'false').length,
    highPriority: factChecks.filter(fc => fc.priority === 'high').length
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-100 via-gray-50 to-blue-50"></div>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-indigo-100/20 rounded-full blur-3xl"></div>
      </div>
      <div className="fixed inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}></div>

      <Header />
      
      <main className="relative max-w-7xl mx-auto px-4 py-8 pb-24">
        {/* Hero */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-white shadow-sm px-4 py-2 rounded-full mb-4 border border-gray-200">
            <Shield className="w-4 h-4 text-red-600" />
            <span className="text-gray-700 text-sm font-semibold">🇧🇩 Bangladesh 2026</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">সাম্প্রতিক তথ্য যাচাই</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            নির্বাচন সংক্রান্ত ভুয়া তথ্য শনাক্তকরণ এবং সঠিক তথ্য প্রদান
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-8 relative z-20">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="খবর, দাবি বা টপিক খুঁজুন..."
              className="block w-full pl-11 pr-10 py-4 bg-white border border-gray-200 rounded-2xl leading-5 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-sm hover:shadow-md transition-all duration-300"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <X className="h-5 w-5 text-gray-400 hover:text-red-600 cursor-pointer" />
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm hover:scale-105 transition-all">
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.total}</div>
            <div className="text-gray-600 text-xs">মোট যাচাই</div>
          </div>
          <div className="bg-red-50 rounded-2xl p-4 border border-red-200 shadow-sm hover:scale-105 transition-all">
            <div className="text-3xl font-bold text-red-600 mb-1 flex items-center gap-1">{stats.false} <AlertTriangle className="w-5 h-5" /></div>
            <div className="text-red-700 text-xs">মিথ্যা দাবি</div>
          </div>
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 shadow-sm hover:scale-105 transition-all">
            <div className="text-3xl font-bold text-amber-600 mb-1 flex items-center gap-1">{stats.highPriority} <TrendingUp className="w-5 h-5" /></div>
            <div className="text-amber-700 text-xs">জরুরি</div>
          </div>
        </div>

        {/* Filters */}
        <CategoryFilter currentCategory={currentCategory} onCategoryChange={setCurrentCategory} />

        {/* Results Count */}
        <div className="bg-white rounded-2xl p-4 mb-6 text-gray-900 text-center border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 flex justify-between items-center px-6">
          <p className="text-sm flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            ফলাফল: <span className="font-bold text-lg">{filteredFactChecks.length}</span> টি
          </p>
          {(searchQuery || currentCategory !== 'all') && (
            <button 
              onClick={() => { setSearchQuery(''); setCurrentCategory('all'); }}
              className="text-xs text-red-600 font-semibold hover:underline"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* --- FACT CHECK GRID WITH INTEGRATION BUTTONS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFactChecks.map((factCheck, index) => (
            <div 
              key={factCheck.id}
              className="flex flex-col gap-3 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <FactCheckCard factCheck={factCheck} />
              
              {/* Integration Button: Link to Generate Page */}
              <Link 
                href={`/generate?id=${factCheck.id}`}
                className="group w-full py-2.5 bg-white border border-indigo-100 text-indigo-600 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-indigo-50 hover:border-indigo-200 hover:shadow-sm transition-all"
              >
                <Palette className="w-4 h-4 group-hover:scale-110 transition-transform" />
                গ্রাফিক্স তৈরি করুন
              </Link>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredFactChecks.length === 0 && (
          <div className="bg-white rounded-3xl p-16 text-center border border-gray-200 shadow-sm">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-900 text-xl font-semibold mb-2">কোনো তথ্য পাওয়া যায়নি</p>
            <p className="text-gray-600">"{searchQuery}" এর জন্য কোনো ফলাফল নেই।</p>
            <button onClick={() => setSearchQuery('')} className="mt-4 text-red-600 font-semibold hover:underline">সব রিপোর্ট দেখুন</button>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}