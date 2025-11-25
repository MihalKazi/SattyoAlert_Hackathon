'use client';

import { useState, useEffect } from 'react';
import { requestNotificationPermission } from '@/lib/firebase/config';
import { toast } from 'react-hot-toast';

export default function NotificationPrompt() {
  const [permission, setPermission] = useState('default');
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check current permission status
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
      
      // Show prompt if permission not decided
      if (Notification.permission === 'default') {
        // Delay showing prompt (don't annoy user immediately)
        const timer = setTimeout(() => {
          setShowPrompt(true);
        }, 5000); // Show after 5 seconds
        
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleEnableNotifications = async () => {
    const result = await requestNotificationPermission();
    
    if (result) {
      setPermission('granted');
      setShowPrompt(false);
      
      toast.success('🔔 নোটিফিকেশন চালু হয়েছে!');
    } else {
      toast.error('নোটিফিকেশন অনুমতি প্রয়োজন');
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't ask again for 24 hours
    if (typeof window !== 'undefined') {
      localStorage.setItem('notification-prompt-dismissed', Date.now().toString());
    }
  };

  // Don't show if already granted or denied
  if (permission !== 'default' || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-24 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-up">
      <div className="bg-white rounded-xl shadow-2xl border-2 border-red-600 p-6">
        <div className="flex items-start gap-4">
          <div className="text-4xl">🔔</div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-2">
              সত্য তথ্যের আপডেট পান
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              গুরুত্বপূর্ণ তথ্য যাচাই এবং জরুরি আপডেটের নোটিফিকেশন পেতে চান?
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleEnableNotifications}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-all"
              >
                হ্যাঁ, চাই
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-all"
              >
                এখন নয়
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}