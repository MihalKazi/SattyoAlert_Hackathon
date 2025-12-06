"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import { toast } from "react-hot-toast";
import { sendDemoNotification } from "@/lib/firebase/config";
import { 
  Shield, 
  Lock, 
  LogOut, 
  FileText, 
  Bell, 
  Send, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  BarChart3, 
  ExternalLink 
} from "lucide-react";

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

  // --- REUSABLE BACKGROUND ---
  const BackgroundLayers = () => (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-white to-purple-50 z-0"></div>
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-50">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-100/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-10 w-96 h-96 bg-red-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl"></div>
      </div>
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" style={{
        backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
      }}></div>
    </>
  );

  // --- LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-white flex flex-col">
        <BackgroundLayers />
        
        <div className="relative z-10">
          <Header />
        </div>

        <main className="flex-1 flex items-center justify-center p-4 relative z-10">
          <div className="w-full max-w-md bg-white/80 backdrop-blur-xl shadow-2xl border border-white/50 rounded-2xl p-8 animate-slide-up">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg transform rotate-3">
                <Shield className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                অ্যাডমিন লগইন
              </h2>
              <p className="text-sm text-gray-600">
                SattyoAlert ড্যাশবোর্ড অ্যাক্সেস করতে পাসওয়ার্ড দিন
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  পাসওয়ার্ড
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-none transition-all"
                    placeholder="পাসওয়ার্ড লিখুন"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3.5 rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
              >
                লগইন করুন <ExternalLink className="w-4 h-4" />
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  // --- DASHBOARD SCREEN ---
  return (
    <div className="min-h-screen relative overflow-hidden bg-white pb-24">
      <BackgroundLayers />

      <div className="relative z-10">
        <Header />

        <main className="max-w-5xl mx-auto px-4 py-8">
          
          {/* Dashboard Header */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 mb-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in">
            <div className="flex items-center gap-4">
              <div className="bg-red-100 p-3 rounded-full">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">অ্যাডমিন প্যানেল</h2>
                <p className="text-sm text-gray-500">স্বাগতম, অ্যাডমিন</p>
              </div>
            </div>
            
            <button
              onClick={() => {
                setIsAuthenticated(false);
                setPassword("");
                toast.success("লগআউট সফল");
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors font-semibold text-sm border border-red-100"
            >
              <LogOut className="w-4 h-4" />
              লগআউট
            </button>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            
            {/* Reports Card */}
            <Link
              href="/admin/reports"
              className="group relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              
              <div className="relative z-10">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Extension Reports</h3>
                <p className="text-gray-500 text-sm mb-4">
                  ব্যবহারকারীদের জমা দেওয়া রিপোর্ট দেখুন এবং যাচাই করুন।
                </p>
                <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:translate-x-2 transition-transform">
                  রিপোর্ট দেখুন <ExternalLink className="w-4 h-4 ml-2" />
                </div>
              </div>
            </Link>

            {/* Notification Card Info (Visual) */}
            <div className="group relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full -mr-8 -mt-8"></div>
              
              <div className="relative z-10">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
                  <Bell className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Send Notifications</h3>
                <p className="text-gray-500 text-sm mb-4">
                  ব্রেকিং এলার্ট এবং আপডেট পাঠান (নিচে অ্যাক্টিভ)।
                </p>
                <div className="text-xs bg-green-50 text-green-700 inline-block px-3 py-1 rounded-full border border-green-100 font-medium">
                  Status: Active
                </div>
              </div>
            </div>
          </div>

          {/* Notification Form Section */}
          <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6 md:p-8 animate-slide-up">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
              <Send className="w-5 h-5 text-red-600" />
              <h3 className="text-xl font-bold text-gray-900">নোটিফিকেশন পাঠান</h3>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-blue-800 text-sm">
                <strong>টিপ:</strong> প্রথমে হেডার থেকে "Enable Alerts" এ ক্লিক করে পারমিশন দিন। 
                ডেমো মোডে ব্রাউজারের নেটিভ নোটিফিকেশন ব্যবহার করা হয়।
              </p>
            </div>

            <div className="space-y-5">
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
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-100 focus:outline-none transition-all"
                  placeholder="শিরোনাম দিন..."
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
                  rows="3"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-100 focus:outline-none transition-all resize-none"
                  placeholder="বিস্তারিত বার্তা লিখুন..."
                />
              </div>

              <button
                onClick={handleSendNotification}
                className="w-full bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                নোটিফিকেশন পাঠান
              </button>
            </div>

            {/* Quick Send Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                দ্রুত টেমপ্লেট ব্যবহার করুন
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    sendDemoNotification(
                      "🚨 জরুরি: মিথ্যা দাবি",
                      "ইভিএম হ্যাকিং সংক্রান্ত ভাইরাল পোস্ট সম্পূর্ণ মিথ্যা"
                    );
                    toast.success("পাঠানো হয়েছে!");
                  }}
                  className="flex items-center gap-2 bg-red-50 text-red-700 p-3 rounded-lg hover:bg-red-100 transition-colors border border-red-100 text-sm font-semibold"
                >
                  <AlertTriangle className="w-4 h-4" />
                  মিথ্যা দাবি এলার্ট
                </button>

                <button
                  onClick={() => {
                    sendDemoNotification(
                      "✅ সত্য তথ্য নিশ্চিত",
                      "ভোটার রেজিস্ট্রেশন সময়সীমা বৃদ্ধি সত্য"
                    );
                    toast.success("পাঠানো হয়েছে!");
                  }}
                  className="flex items-center gap-2 bg-green-50 text-green-700 p-3 rounded-lg hover:bg-green-100 transition-colors border border-green-100 text-sm font-semibold"
                >
                  <CheckCircle className="w-4 h-4" />
                  সত্য তথ্য এলার্ট
                </button>

                <button
                  onClick={() => {
                    sendDemoNotification(
                      "📊 দৈনিক সারসংক্ষেপ",
                      "আজ ১০টি দাবি যাচাই | ৬টি মিথ্যা | ২টি সত্য"
                    );
                    toast.success("পাঠানো হয়েছে!");
                  }}
                  className="flex items-center gap-2 bg-blue-50 text-blue-700 p-3 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100 text-sm font-semibold"
                >
                  <BarChart3 className="w-4 h-4" />
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
                  className="flex items-center gap-2 bg-amber-50 text-amber-700 p-3 rounded-lg hover:bg-amber-100 transition-colors border border-amber-100 text-sm font-semibold"
                >
                  <AlertTriangle className="w-4 h-4" />
                  বিভ্রান্তিকর
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}