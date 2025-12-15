"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import { toast } from "react-hot-toast";
import { sendDemoNotification } from "@/lib/firebase/config";
import { runBulkSync } from "@/lib/batchSync"; // Ensure this uses syncToVectorAction inside
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
  ExternalLink,
  RefreshCw,
  Database
} from "lucide-react";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [isSyncing, setIsSyncing] = useState(false); 

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

  // --- SEMANTIC SEARCH SYNC HANDLER ---
  const handleSync = async () => {
    const confirmAction = window.confirm("এটি ডাটাবেসের সকল তথ্যকে AI সার্চের জন্য ইনডেক্স করবে। শুরু করবেন?");
    if (!confirmAction) return;

    setIsSyncing(true);
    const tid = toast.loading("AI সার্চ ইনডেক্সিং চলছে... (এটি কিছুক্ষণ সময় নিতে পারে)");

    try {
      // runBulkSync calls the Server Action for each record
      const result = await runBulkSync();
      
      if (result.success) {
        toast.success(result.message, { id: tid });
      } else {
        toast.error(`Sync Failed: ${result.error}`, { id: tid });
      }
    } catch (err) {
      toast.error("সার্ভার সংযোগে ত্রুটি বা টাইমআউট।", { id: tid });
      console.error(err);
    } finally {
      setIsSyncing(false);
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-white flex flex-col font-sans">
        <BackgroundLayers />
        <div className="relative z-10"><Header /></div>
        <main className="flex-1 flex items-center justify-center p-4 relative z-10">
          <div className="w-full max-w-md bg-white/80 backdrop-blur-xl shadow-2xl border border-white/50 rounded-2xl p-8 animate-slide-up">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg transform rotate-3">
                <Shield className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">অ্যাডমিন লগইন</h2>
              <p className="text-sm text-gray-600">SattyoAlert ড্যাশবোর্ড অ্যাক্সেস করতে পাসওয়ার্ড দিন</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">পাসওয়ার্ড</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
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
              <button type="submit" className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3.5 rounded-xl font-bold hover:shadow-lg transition-all active:scale-95">
                লগইন করুন
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-white pb-24 font-sans antialiased">
      <BackgroundLayers />
      <div className="relative z-10">
        <Header />
        <main className="max-w-5xl mx-auto px-4 py-8">
          
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 mb-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-red-100 p-3 rounded-full"><Shield className="w-6 h-6 text-red-600" /></div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">অ্যাডমিন প্যানেল</h2>
                <p className="text-sm text-gray-500">স্বাগতম, অ্যাডমিন</p>
              </div>
            </div>
            <button onClick={() => setIsAuthenticated(false)} className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 font-semibold text-sm border border-red-100 transition-colors">
              <LogOut className="w-4 h-4" /> লগআউট
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Link href="/admin/reports" className="group bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-8 -mt-8"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Extension Reports</h3>
                <p className="text-gray-500 text-sm mb-4">ব্যবহারকারীদের জমা দেওয়া রিপোর্ট যাচাই করুন।</p>
                <div className="flex items-center text-blue-600 font-bold text-sm">রিপোর্ট দেখুন <ExternalLink className="w-4 h-4 ml-2" /></div>
              </div>
            </Link>

            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-8 -mt-8"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                  <Database className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Semantic AI Search</h3>
                <p className="text-gray-500 text-sm mb-4">সব রিপোর্টকে AI সার্চ ইঞ্জিনের সাথে সিঙ্ক করুন।</p>
                <button 
                  onClick={handleSync}
                  disabled={isSyncing}
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-sm transition-all 
                    ${isSyncing ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 active:scale-95'}`}
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'Indexing...' : 'AI সার্চ সিঙ্ক করুন'}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-8 animate-slide-up">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
              <Send className="w-5 h-5 text-red-600" />
              <h3 className="text-xl font-bold text-gray-900">নোটিফিকেশন পাঠান</h3>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-blue-800 text-sm italic font-medium">ব্রাউজারে রিয়েল-টাইম এলার্ট পাঠানোর জন্য এই টুলটি ব্যবহার করুন।</p>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-tight">শিরোনাম</label>
                  <input
                    type="text"
                    value={notification.title}
                    onChange={(e) => setNotification({ ...notification, title: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-none transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-tight">বার্তা</label>
                  <textarea
                    value={notification.body}
                    onChange={(e) => setNotification({ ...notification, body: e.target.value })}
                    rows="1"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-red-500 focus:outline-none transition-all font-medium resize-none"
                  />
                </div>
              </div>
              <button onClick={handleSendNotification} className="w-full bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 shadow-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
                <Bell className="w-4 h-4" /> এলার্ট পাঠান
              </button>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-100">
               <h4 className="text-xs font-black text-slate-400 mb-4 uppercase tracking-widest">এলার্ট টেমপ্লেট</h4>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <button onClick={() => sendDemoNotification("🚨 জরুরি: গুজব", "ইভিএম হ্যাকিং পোস্টটি মিথ্যা।")} className="p-3 text-xs font-bold rounded-lg border border-red-100 bg-red-50 text-red-700 hover:bg-red-100 transition-colors flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3" /> মিথ্যা গুজব
                  </button>
                  <button onClick={() => sendDemoNotification("✅ সত্য তথ্য", "রেজিস্ট্রেশন বৃদ্ধি সত্য।")} className="p-3 text-xs font-bold rounded-lg border border-green-100 bg-green-50 text-green-700 hover:bg-green-100 transition-colors flex items-center gap-2">
                    <CheckCircle className="w-3 h-3" /> সত্য তথ্য
                  </button>
                  <button onClick={() => sendDemoNotification("📊 দৈনিক আপডেট", "আজকের সকল তথ্য যাচাইকৃত।")} className="p-3 text-xs font-bold rounded-lg border border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors flex items-center gap-2">
                    <BarChart3 className="w-3 h-3" /> দৈনিক সারাংশ
                  </button>
                  <button onClick={() => sendDemoNotification("⚠️ বিভ্রান্তিকর", "তথ্যটি আংশিক সঠিক।")} className="p-3 text-xs font-bold rounded-lg border border-amber-100 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors flex items-center gap-2">
                    <Info className="w-3 h-3" /> বিভ্রান্তিকর
                  </button>
               </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}