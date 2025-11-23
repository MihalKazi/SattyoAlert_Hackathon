'use client';

import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';

export default function SummaryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-800">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8 pb-24">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-2">
            দৈনিক সারসংক্ষেপ
          </h2>
          <p className="text-purple-100 text-lg">
            আজকের গুরুত্বপূর্ণ তথ্য যাচাই
          </p>
        </div>

        <div className="bg-white rounded-xl p-8 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            শীঘ্রই আসছে!
          </h3>
          <p className="text-gray-600">
            দৈনিক সারসংক্ষেপ পেজ তৈরি হচ্ছে। Day 5 এ এটি সম্পূর্ণ হবে।
          </p>
          <div className="mt-6 p-4 bg-purple-50 rounded-lg text-left">
            <p className="text-sm text-purple-800 font-semibold mb-2">এই পেজে থাকবে:</p>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>✅ আজকের সব তথ্য যাচাইয়ের সারাংশ</li>
              <li>✅ উচ্চ গুরুত্বপূর্ণ মিথ্যা দাবি</li>
              <li>✅ সত্য তথ্যের তালিকা</li>
              <li>✅ বিভ্রান্তিকর বিষয়বস্তু</li>
              <li>✅ দৈনিক পরিসংখ্যান</li>
            </ul>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}