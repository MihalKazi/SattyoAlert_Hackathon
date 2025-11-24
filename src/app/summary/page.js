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
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-800">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-8 pb-24">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-2">
            দৈনিক সারসংক্ষেপ
          </h2>
          <p className="text-purple-100 text-lg">
            আজকের গুরুত্বপূর্ণ তথ্য যাচাই
          </p>
        </div>

        {/* Date Banner */}
        <div className="bg-red-600 text-white rounded-xl p-4 mb-8 text-center shadow-lg">
          <p className="text-xl font-bold">📅 {getTodayBangla()}</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Total */}
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <div className="text-4xl font-bold text-purple-600 mb-2">{stats.total}</div>
            <p className="text-sm text-gray-600 font-semibold">মোট যাচাই</p>
          </div>

          {/* False */}
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <div className="text-4xl font-bold text-red-600 mb-2">{stats.falseCount}</div>
            <p className="text-sm text-gray-600 font-semibold">মিথ্যা দাবি</p>
          </div>

          {/* True */}
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <div className="text-4xl font-bold text-green-600 mb-2">{stats.trueCount}</div>
            <p className="text-sm text-gray-600 font-semibold">সত্য তথ্য</p>
          </div>

          {/* Misleading */}
          <div className="bg-white rounded-xl p-6 text-center shadow-lg">
            <div className="text-4xl font-bold text-amber-600 mb-2">{stats.misleadingCount}</div>
            <p className="text-sm text-gray-600 font-semibold">বিভ্রান্তিকর</p>
          </div>
        </div>

        {/* Engagement Stats */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{stats.totalViews.toLocaleString()}</p>
                <p className="text-purple-100">মোট ভিউ</p>
              </div>
              <div className="text-5xl">👁️</div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{stats.totalShares.toLocaleString()}</p>
                <p className="text-purple-100">মোট শেয়ার</p>
              </div>
              <div className="text-5xl">📤</div>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-lg">
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
                      className="bg-red-600 h-full rounded-full transition-all"
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
        <div className="bg-white rounded-xl p-6 mb-8 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🔴</span>
            <h3 className="text-xl font-bold text-gray-900">জরুরি: উচ্চ অগ্রাধিকার মিথ্যা দাবি</h3>
          </div>
          <div className="space-y-4">
            {falseClaims.map((fc) => (
              <div key={fc.id} className="border-l-4 border-red-600 bg-red-50 p-4 rounded-r-lg">
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
        <div className="bg-white rounded-xl p-6 mb-8 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">✅</span>
            <h3 className="text-xl font-bold text-gray-900">সত্য তথ্য</h3>
          </div>
          <div className="space-y-4">
            {trueClaims.map((fc) => (
              <div key={fc.id} className="border-l-4 border-green-600 bg-green-50 p-4 rounded-r-lg">
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
        <div className="bg-white rounded-xl p-6 mb-8 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">⚠️</span>
            <h3 className="text-xl font-bold text-gray-900">বিভ্রান্তিকর বিষয়বস্তু</h3>
          </div>
          <div className="space-y-4">
            {misleadingClaims.map((fc) => (
              <div key={fc.id} className="border-l-4 border-amber-500 bg-amber-50 p-4 rounded-r-lg">
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
        <div className="bg-purple-900 text-white rounded-xl p-6 text-center shadow-lg">
          <p className="text-lg mb-2">
            <span className="font-bold">আজ মোট {stats.total}টি দাবি যাচাই করা হয়েছে</span>
          </p>
          <p className="text-purple-200 text-sm">
            সত্য তথ্য ছড়িয়ে দিন এবং গণতন্ত্র রক্ষায় অবদান রাখুন 🇧🇩
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}