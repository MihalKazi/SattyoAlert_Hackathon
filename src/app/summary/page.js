'use client';

import { useMemo } from 'react';
import Header from '@/components/layout/Header'; // Assuming this is your Red-branded header
import BottomNav from '@/components/layout/BottomNav'; // Assuming this is your Red-branded nav
import { factChecks, getCategoryName, getStatusName } from '@/data/sampleFactChecks';
import { ExternalLink, TrendingUp, Share2, Eye, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

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
    <div className="min-h-screen relative overflow-hidden bg-white pb-24">
      {/* --- BACKGROUND LAYERS (White/Purple Glassmorphism) --- */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-white to-purple-50 z-0"></div>
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-50">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-100/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-10 w-96 h-96 bg-indigo-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl"></div>
      </div>
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" style={{
        backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
      }}></div>

      {/* Content Wrapper */}
      <div className="relative z-10">
        <Header />
      
        <main className="max-w-6xl mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="text-center mb-8 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
              দৈনিক সারসংক্ষেপ
            </h2>
            <p className="text-gray-600">
              আজকের গুরুত্বপূর্ণ তথ্য যাচাই রিপোর্ট
            </p>
          </div>

          {/* Date Banner */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl p-4 mb-8 text-center shadow-lg shadow-red-200/50 animate-slide-up transform hover:scale-[1.01] transition-transform">
            <p className="text-lg md:text-xl font-bold flex items-center justify-center gap-2">
              📅 {getTodayBangla()}
            </p>
          </div>

          {/* Statistics Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {/* Total */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm border border-indigo-100 hover:shadow-md transition-all">
              <div className="text-3xl font-bold text-indigo-600 mb-1">{stats.total}</div>
              <p className="text-xs text-gray-600 font-semibold">মোট যাচাই</p>
            </div>

            {/* False */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm border border-red-100 hover:shadow-md transition-all">
              <div className="text-3xl font-bold text-red-600 mb-1">{stats.falseCount}</div>
              <p className="text-xs text-gray-600 font-semibold">মিথ্যা দাবি</p>
            </div>

            {/* True */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm border border-green-100 hover:shadow-md transition-all">
              <div className="text-3xl font-bold text-green-600 mb-1">{stats.trueCount}</div>
              <p className="text-xs text-gray-600 font-semibold">সত্য তথ্য</p>
            </div>

            {/* Misleading */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm border border-amber-100 hover:shadow-md transition-all">
              <div className="text-3xl font-bold text-amber-500 mb-1">{stats.misleadingCount}</div>
              <p className="text-xs text-gray-600 font-semibold">বিভ্রান্তিকর</p>
            </div>
          </div>

          {/* Engagement Stats */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white/90 rounded-xl p-5 border border-purple-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
                <p className="text-sm text-gray-600">মোট ভিউ</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                <Eye className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white/90 rounded-xl p-5 border border-blue-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalShares.toLocaleString()}</p>
                <p className="text-sm text-gray-600">মোট শেয়ার</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <Share2 className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white/90 backdrop-blur rounded-xl p-6 mb-8 shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gray-700" />
              বিভাগ অনুযায়ী বিশ্লেষণ
            </h3>
            <div className="space-y-4">
              {Object.entries(stats.categoryBreakdown).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between group">
                  <div className="flex items-center gap-2 text-gray-700 w-1/3">
                    <span className="font-medium text-sm">{getCategoryName(category)}</span>
                  </div>
                  <div className="flex-1 px-4">
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-indigo-600 h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${(count / stats.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900 w-8 text-right text-sm">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* --- LINKS TO SOURCE URL IMPLEMENTED BELOW --- */}

          {/* High Priority False Claims */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4 px-1">
              <XCircle className="w-6 h-6 text-red-600" />
              <h3 className="text-xl font-bold text-gray-900">জরুরি: উচ্চ অগ্রাধিকার মিথ্যা দাবি</h3>
            </div>
            <div className="space-y-4">
              {falseClaims.map((fc) => (
                <a 
                  key={fc.id}
                  href={fc.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group relative bg-white rounded-xl border-l-4 border-red-500 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-5 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="w-5 h-5 text-gray-400" />
                  </div>
                  
                  <div className="flex items-start justify-between mb-3 pr-6">
                    <h4 className="font-bold text-gray-900 text-lg leading-snug group-hover:text-red-700 transition-colors">
                      {fc.claim}
                    </h4>
                  </div>
                  
                  <div className="bg-red-50 p-3 rounded-lg mb-3">
                    <p className="text-sm text-gray-800">
                      <span className="font-bold text-red-700">ফলাফল: </span>
                      {fc.verdict}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 mt-2 border-t pt-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-gray-100 px-2 py-1 rounded text-gray-700 font-medium">
                        {fc.source}
                      </span>
                      <span>{fc.date}</span>
                    </div>
                    <div className="flex gap-3">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {fc.views}</span>
                      <span className="flex items-center gap-1"><Share2 className="w-3 h-3" /> {fc.shares}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* True Information */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4 px-1">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-bold text-gray-900">সত্য তথ্য</h3>
            </div>
            <div className="space-y-4">
              {trueClaims.map((fc) => (
                <a 
                  key={fc.id}
                  href={fc.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group relative bg-white rounded-xl border-l-4 border-green-500 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-5"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="w-5 h-5 text-gray-400" />
                  </div>

                  <div className="flex items-start justify-between mb-3 pr-6">
                    <h4 className="font-bold text-gray-900 text-lg leading-snug group-hover:text-green-700 transition-colors">
                      {fc.claim}
                    </h4>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 bg-green-50 p-3 rounded-lg">
                    {fc.verdict}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 mt-2 border-t pt-3">
                    <span className="bg-gray-100 px-2 py-1 rounded text-gray-700 font-medium">
                      {fc.source}
                    </span>
                    <div className="flex gap-3">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {fc.views}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Misleading Content */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4 px-1">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
              <h3 className="text-xl font-bold text-gray-900">বিভ্রান্তিকর বিষয়বস্তু</h3>
            </div>
            <div className="space-y-4">
              {misleadingClaims.map((fc) => (
                <a 
                  key={fc.id}
                  href={fc.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group relative bg-white rounded-xl border-l-4 border-amber-400 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-5"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="w-5 h-5 text-gray-400" />
                  </div>

                  <div className="flex items-start justify-between mb-3 pr-6">
                    <h4 className="font-bold text-gray-900 text-lg leading-snug group-hover:text-amber-600 transition-colors">
                      {fc.claim}
                    </h4>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 bg-amber-50 p-3 rounded-lg">
                    {fc.verdict}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 mt-2 border-t pt-3">
                    <span className="bg-gray-100 px-2 py-1 rounded text-gray-700 font-medium">
                      {fc.source}
                    </span>
                    <div className="flex gap-3">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {fc.views}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Summary Footer */}
          <div className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-xl p-6 text-center shadow-lg shadow-red-200">
            <p className="text-lg mb-2">
              <span className="font-bold">আজ মোট {stats.total}টি দাবি যাচাই করা হয়েছে</span>
            </p>
            <p className="text-red-100 text-sm">
              সত্য তথ্য ছড়িয়ে দিন এবং গণতন্ত্র রক্ষায় অবদান রাখুন 🇧🇩
            </p>
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}