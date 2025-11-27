"use client";

import { useState } from "react";
import Link from "next/link"; // ADD THIS IMPORT
import Header from "@/components/layout/Header";
import { toast } from "react-hot-toast";
import { sendDemoNotification } from "@/lib/firebase/config";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  const [notification, setNotification] = useState({
    title: "মিথ্যা দাবি শনাক্ত!",
    body: "ইভিএম মেশিন হ্যাক সংক্রান্ত ভাইরাল পোস্ট সম্পূর্ণ মিথ্যা।",
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "admin123") {
      setIsAuthenticated(true);
      toast.success("✅ অ্যাডমিন লগইন সফল!");
    } else {
      toast.error("❌ ভুল পাসওয়ার্ড!");
    }
  };

  const handleSendNotification = () => {
    const sent = sendDemoNotification(notification.title, notification.body);

    if (sent) {
      toast.success("✅ নোটিফিকেশন পাঠানো হয়েছে!");
    } else {
      toast.error("❌ প্রথমে নোটিফিকেশন অনুমতি দিন");
    }
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-800">
        <Header />

        <main className="max-w-md mx-auto px-4 py-20">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🔐</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                অ্যাডমিন লগইন
              </h2>
              <p className="text-sm text-gray-600">
                অ্যাক্সেস করতে পাসওয়ার্ড প্রয়োজন
              </p>
            </div>

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  পাসওয়ার্ড
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none"
                  placeholder="পাসওয়ার্ড লিখুন"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-all"
              >
                লগইন করুন
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-800">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">
              🔐 অ্যাডমিন প্যানেল
            </h2>
            <button
              onClick={() => {
                setIsAuthenticated(false);
                setPassword("");
                toast.success("লগআউট সফল");
              }}
              className="text-sm text-gray-600 hover:text-red-600 font-semibold"
            >
              লগআউট
            </button>
          </div>

          {/* Quick Actions Grid - FIXED */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Link
              href="/admin/reports"
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg hover:shadow-xl transition-all group cursor-pointer block"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-4xl mb-2">📋</div>
                  <h3 className="text-xl font-bold mb-1">Extension Reports</h3>
                  <p className="text-sm text-blue-100">
                    View &amp; manage user submissions
                  </p>
                </div>
                <div className="text-3xl group-hover:translate-x-2 transition-transform">
                  →
                </div>
              </div>
            </Link>

            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-4xl mb-2">🔔</div>
                  <h3 className="text-xl font-bold mb-1">Send Notifications</h3>
                  <p className="text-sm text-green-100">
                    Alert users instantly
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              <strong>💡 টিপ:</strong> প্রথমে &quot;Enable Alerts&quot; বাটনে
              ক্লিক করে নোটিফিকেশন অনুমতি দিন, তারপর এখান থেকে পাঠান।
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
                onChange={(e) =>
                  setNotification({ ...notification, title: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                বার্তা
              </label>
              <textarea
                value={notification.body}
                onChange={(e) =>
                  setNotification({ ...notification, body: e.target.value })
                }
                rows="4"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none resize-none"
              />
            </div>

            <button
              onClick={handleSendNotification}
              className="w-full bg-red-600 text-white py-4 rounded-lg font-bold hover:bg-red-700 transition-all"
            >
              📤 নোটিফিকেশন পাঠান
            </button>
          </div>

          {/* Quick Send Buttons */}
          <div className="mt-6">
            <h3 className="text-sm font-bold text-gray-700 mb-3">
              দ্রুত পাঠান:
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  sendDemoNotification(
                    "🚨 জরুরি: মিথ্যা দাবি",
                    "ইভিএম হ্যাকিং সংক্রান্ত ভাইরাল পোস্ট সম্পূর্ণ মিথ্যা"
                  );
                  toast.success("পাঠানো হয়েছে!");
                }}
                className="bg-red-100 text-red-700 py-3 rounded-lg font-semibold hover:bg-red-200 transition-all text-sm"
              >
                মিথ্যা দাবি
              </button>

              <button
                onClick={() => {
                  sendDemoNotification(
                    "✅ সত্য তথ্য নিশ্চিত",
                    "ভোটার রেজিস্ট্রেশন সময়সীমা বৃদ্ধি সত্য"
                  );
                  toast.success("পাঠানো হয়েছে!");
                }}
                className="bg-green-100 text-green-700 py-3 rounded-lg font-semibold hover:bg-green-200 transition-all text-sm"
              >
                সত্য তথ্য
              </button>

              <button
                onClick={() => {
                  sendDemoNotification(
                    "📊 দৈনিক সারসংক্ষেপ",
                    "আজ ১০টি দাবি যাচাই | ৬টি মিথ্যা | ২টি সত্য"
                  );
                  toast.success("পাঠানো হয়েছে!");
                }}
                className="bg-blue-100 text-blue-700 py-3 rounded-lg font-semibold hover:bg-blue-200 transition-all text-sm"
              >
                দৈনিক সারাংশ
              </button>

              <button
                onClick={() => {
                  sendDemoNotification(
                    "⚠️ বিভ্রান্তিকর তথ্য",
                    "ভোট কেন্দ্র পরিবর্তন: আংশিক সত্য, সারাদেশে নয়"
                  );
                  toast.success("পাঠানো হয়েছে!");
                }}
                className="bg-amber-100 text-amber-700 py-3 rounded-lg font-semibold hover:bg-amber-200 transition-all text-sm"
              >
                বিভ্রান্তিকর
              </button>
            </div>
          </div>

          <div className="mt-8 p-4 bg-purple-50 rounded-lg">
            <h3 className="font-bold text-purple-900 mb-2">
              ডেমো মোড সম্পর্কে:
            </h3>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>✓ ব্রাউজার নেটিভ নোটিফিকেশন ব্যবহার করছে</li>
              <li>✓ প্রোডাকশনে Firebase Cloud Messaging হবে</li>
              <li>✓ সব ইউজারের টোকেন রিট্রিভ করে পাঠাবে</li>
              <li>✓ টপিক-ভিত্তিক এবং সিডিউলড নোটিফিকেশন</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
