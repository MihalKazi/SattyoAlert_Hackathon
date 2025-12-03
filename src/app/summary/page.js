'use client';

import { useMemo } from 'react';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import { factChecks, getCategoryName, getStatusName } from '@/data/sampleFactChecks';

export default function SummaryPage() {
  // Calculate statistics
  const stats = useMemo(() => {
    const total = factChecks.length;
    const falseCount = factChecks.filter(fc => fc.status === 'false').length;
    const trueCount = factChecks.filter(fc => fc.status === 'true').length;
    const misleadingCount = factChecks.filter(fc => fc.status === 'misleading').length;

    const categoryBreakdown = {
      election: factChecks.filter(fc => fc.category === 'election').length,
      religious: factChecks.filter(fc => fc.category === 'religious').length,
      scam: factChecks.filter(fc => fc.category === 'scam').length,
      health: factChecks.filter(fc => fc.category === 'health').length,
    };

    const highPriority = factChecks.filter(fc => fc.priority === 'high');
    const totalViews = factChecks.reduce((sum, fc) => sum + fc.views, 0);
    const totalShares = factChecks.reduce((sum, fc) => sum + fc.shares, 0);

    return {
      total,
      falseCount,
      trueCount,
      misleadingCount,
      categoryBreakdown,
      highPriority,
      totalViews,
      totalShares
    };
  }, []);

  // Get fact-checks by status
  const falseClaims = factChecks.filter(fc => fc.status === 'false' && fc.priority === 'high');
  const trueClaims = factChecks.filter(fc => fc.status === 'true');
  const misleadingClaims = factChecks.filter(fc => fc.status === 'misleading');

  // Get today's date in Bangla
  const getTodayBangla = () => {
    const days = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
    const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
    
    const today = new Date();
    const dayName = days[today.getDay()];
    const date = today.getDate();
    const month = months[today.getMonth()];
    const year = today.getFullYear();
    
    return `${date} ${month}, ${year} - ${dayName}`;
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50">
      {/* Professional Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-50"></div>
      
      {/* Subtle Accent Circles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-100/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-indigo-100/15 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 left-1/4 w-80 h-80 bg-slate-100/20 rounded-full blur-3xl"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 100 0 L 0 0 0 100' fill='none' stroke='white' stroke-width='1'/%3E%3C/svg%3E")`,
        backgroundSize: '50px 50px',
      }}></div>

      <Header />
      
      <main className="relative max-w-6xl mx-auto px-4 py-8 pb-24">
        {/* Page Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            দৈনিক সারসংক্ষেপ
          </h2>
          <p className="text-gray-600 text-lg">
            আজকের গুরুত্বপূর্ণ তথ্য যাচাই
          </p>
        </div>

        {/* Date Banner */}
        <div className="bg-red-600 text-white rounded-xl p-4 mb-8 text-center shadow-lg animate-slide-up">
          <p className="text-xl font-bold">📅 {getTodayBangla()}</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Total */}
          <div className="bg-white rounded-xl p-6 text-center shadow-md border border-gray-200 hover:scale-105 transition-all duration-300 animate-slide-up delay-100">
            <div className="text-4xl font-bold text-indigo-600 mb-2">{stats.total}</div>
            <p className="text-sm text-gray-600 font-semibold">মোট যাচাই</p>
          </div>

          {/* False */}
          <div className="bg-white rounded-xl p-6 text-center shadow-md border border-gray-200 hover:scale-105 transition-all duration-300 animate-slide-up delay-200">
            <div className="text-4xl font-bold text-red-600 mb-2">{stats.falseCount}</div>
            <p className="text-sm text-gray-600 font-semibold">মিথ্যা দাবি</p>
          </div>

          {/* True */}
          <div className="bg-white rounded-xl p-6 text-center shadow-md border border-gray-200 hover:scale-105 transition-all duration-300 animate-slide-up delay-300">
            <div className="text-4xl font-bold text-green-600 mb-2">{stats.trueCount}</div>
            <p className="text-sm text-gray-600 font-semibold">সত্য তথ্য</p>
          </div>

          {/* Misleading */}
          <div className="bg-white rounded-xl p-6 text-center shadow-md border border-gray-200 hover:scale-105 transition-all duration-300 animate-slide-up delay-500">
            <div className="text-4xl font-bold text-amber-600 mb-2">{stats.misleadingCount}</div>
            <p className="text-sm text-gray-600 font-semibold">বিভ্রান্তিকর</p>
          </div>
        </div>

        {/* Engagement Stats */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
                <p className="text-gray-600">মোট ভিউ</p>
              </div>
              <div className="text-5xl">👁️</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{stats.totalShares.toLocaleString()}</p>
                <p className="text-gray-600">মোট শেয়ার</p>
              </div>
              <div className="text-5xl">📤</div>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-md border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">📊 বিভাগ অনুযায়ী</h3>
          <div className="space-y-3">
            {Object.entries(stats.categoryBreakdown).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="font-semibold text-gray-700">
                  {getCategoryName(category)}
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-48 bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-blue-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${(count / stats.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="font-bold text-gray-900 w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* High Priority False Claims */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-md border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🔴</span>
            <h3 className="text-xl font-bold text-gray-900">জরুরি: উচ্চ অগ্রাধিকার মিথ্যা দাবি</h3>
          </div>
          <div className="space-y-4">
            {falseClaims.map((fc) => (
              <div key={fc.id} className="border-l-4 border-red-600 bg-red-50 p-4 rounded-r-lg hover:shadow-md transition-all duration-300">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold text-gray-900 flex-1">{fc.claim}</h4>
                  <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold ml-4">
                    মিথ্যা
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{fc.verdict}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>সূত্র: {fc.source}</span>
                  <span>👁️ {fc.views.toLocaleString()} | 📤 {fc.shares.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* True Information */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-md border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">✅</span>
            <h3 className="text-xl font-bold text-gray-900">সত্য তথ্য</h3>
          </div>
          <div className="space-y-4">
            {trueClaims.map((fc) => (
              <div key={fc.id} className="border-l-4 border-green-600 bg-green-50 p-4 rounded-r-lg hover:shadow-md transition-all duration-300">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold text-gray-900 flex-1">{fc.claim}</h4>
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold ml-4">
                    সত্য
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{fc.verdict}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>সূত্র: {fc.source}</span>
                  <span>👁️ {fc.views.toLocaleString()} | 📤 {fc.shares.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Misleading Content */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-md border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">⚠️</span>
            <h3 className="text-xl font-bold text-gray-900">বিভ্রান্তিকর বিষয়বস্তু</h3>
          </div>
          <div className="space-y-4">
            {misleadingClaims.map((fc) => (
              <div key={fc.id} className="border-l-4 border-amber-500 bg-amber-50 p-4 rounded-r-lg hover:shadow-md transition-all duration-300">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold text-gray-900 flex-1">{fc.claim}</h4>
                  <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold ml-4">
                    বিভ্রান্তিকর
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{fc.verdict}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>সূত্র: {fc.source}</span>
                  <span>👁️ {fc.views.toLocaleString()} | 📤 {fc.shares.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Footer */}
        <div className="bg-indigo-600 text-white rounded-xl p-6 text-center shadow-lg">
          <p className="text-lg mb-2">
            <span className="font-bold">আজ মোট {stats.total}টি দাবি যাচাই করা হয়েছে</span>
          </p>
          <p className="text-indigo-100 text-sm">
            সত্য তথ্য ছড়িয়ে দিন এবং গণতন্ত্র রক্ষায় অবদান রাখুন 🇧🇩
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}