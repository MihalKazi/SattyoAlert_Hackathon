'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import { toast } from 'react-hot-toast';

export default function AdminPage() {
  const [notification, setNotification] = useState({
    title: 'মিথ্যা দাবি শনাক্ত!',
    body: 'ইভিএম মেশিন হ্যাক সংক্রান্ত ভাইরাল পোস্ট সম্পূর্ণ মিথ্যা।',
  });

  const handleSendNotification = () => {
    // For demo, just show a toast
    // In production, this would call a Firebase Cloud Function
    toast.success('নোটিফিকেশন পাঠানো হয়েছে! (ডেমো মোড)');
    
    // Simulate notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-800">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            🔐 অ্যাডমিন প্যানেল (ডেমো)
          </h2>

          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              <strong>নোট:</strong> এটি একটি ডেমো ইন্টারফেস। প্রোডাকশনে এটি Firebase Cloud Functions ব্যবহার করবে।
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                নোটিফিকেশন শিরোনাম
              </label>
              <input
                type="text"
                value={notification.title}
                onChange={(e) => setNotification({...notification, title: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                বার্তা
              </label>
              <textarea
                value={notification.body}
                onChange={(e) => setNotification({...notification, body: e.target.value})}
                rows="4"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none resize-none"
              />
            </div>

            <button
              onClick={handleSendNotification}
              className="w-full bg-red-600 text-white py-4 rounded-lg font-bold hover:bg-red-700 transition-all"
            >
              📤 নোটিফিকেশন পাঠান (ডেমো)
            </button>
          </div>

          <div className="mt-8 p-4 bg-purple-50 rounded-lg">
            <h3 className="font-bold text-purple-900 mb-2">প্রোডাকশনে:</h3>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>✓ Firebase Cloud Functions দিয়ে পাঠানো হবে</li>
              <li>✓ সব ইউজারের টোকেন রিট্রিভ করে পাঠাবে</li>
              <li>✓ টপিক-ভিত্তিক নোটিফিকেশন (নির্বাচন, ধর্মীয়, ইত্যাদি)</li>
              <li>✓ সিডিউলড নোটিফিকেশন (দৈনিক সারসংক্ষেপ)</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}