'use client'; // <-- CONFIRMED CLIENT DIRECTIVE IS HERE

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import Header from '@/components/layout/Header';
import FactCheckCard from '@/components/fact-checks/FactCheckCard';
import CategoryFilter from '@/components/fact-checks/CategoryFilter';
import { Search, Loader2, Palette, Shield, X } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentCategory, setCurrentCategory] = useState('all');

  // Helper to extract domain name
  const getDomain = (url) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch (e) {
      return 'External Link';
    }
  };

  useEffect(() => {
    const fetchPublicReports = async () => {
      try {
        const q = query(
          collection(db, 'reports'),
          where('status', 'in', ['verified', 'false', 'misleading']),
          limit(50)
        );
        const querySnapshot = await getDocs(q);
        const data = [];
        
        querySnapshot.forEach((doc) => {
          const rawData = doc.data();
          
          // MAP FIRESTORE DATA TO FactCheckCard PROPS
          data.push({
            id: doc.id,
            claim: rawData.claim,
            status: rawData.status,
            category: rawData.category || 'other',
            priority: rawData.urgency || 'Normal',
            
            // Use the verdict from the database if available
            verdict: rawData.verdict || 'বিস্তারিত তথ্য জানতে ক্লিক করুন।', 
            
            sourceUrl: rawData.verifiedSourceUrl || rawData.sourceUrl,
            source: getDomain(rawData.verifiedSourceUrl || rawData.sourceUrl) || 'FactCheck Team',
            
            date: rawData.reviewedAt, 
            
            // Randomize stats for visual appeal
            views: Math.floor(Math.random() * 5000) + 500,
            shares: Math.floor(Math.random() * 1000) + 100
          });
        });

        data.sort((a, b) => (b.date?.toDate?.() || 0) - (a.date?.toDate?.() || 0));
        setReports(data);
      } catch (error) {
        console.error("Error fetching feed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicReports();
  }, []);

  // Filter Logic: Category AND Search Term
  const filteredReports = reports.filter(r => {
    const matchesCategory = currentCategory === 'all' || r.category === currentCategory;
    
    const query = searchTerm.toLowerCase();
    const matchesSearch = 
      r.claim.toLowerCase().includes(query) || 
      r.verdict.toLowerCase().includes(query) ||
      r.source.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      <Header />
      
      {/* Hero Header and Search */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
               <div className="flex items-center gap-2 mb-2">
                 <div className="bg-red-50 px-3 py-1 rounded-full flex items-center gap-2 border border-red-100">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <span className="text-xs font-bold text-red-600 uppercase">লাইভ যাচাই</span>
                 </div>
               </div>
               <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                 গুজব রুখুন, <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">সত্য জানুন</span>
               </h1>
            </div>

            <div className="w-full md:w-96 relative">
              <input 
                type="text" 
                placeholder="খবর, দাবি বা টপিক খুঁজুন..."
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-100 border-none focus:ring-2 focus:ring-red-500 text-sm font-medium transition-all placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-200">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <CategoryFilter currentCategory={currentCategory} onCategoryChange={setCurrentCategory} />
      </div>

      {/* Grid Feed */}
      <div className="max-w-7xl mx-auto px-4">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-slate-300" />
          </div>
        ) : (
          <>
             {filteredReports.length === 0 ? (
               <div className="text-center py-20">
                 <p className="text-slate-400 font-medium">আপনার খোঁজা ফলাফল পাওয়া যায়নি।</p>
               </div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {filteredReports.map((report) => (
                   <div key={report.id} className="flex flex-col animate-fade-in-up h-full">
                     
                     {/* The Card */}
                     <FactCheckCard factCheck={report} />
                     
                     {/* The Graphics Button */}
                     <Link 
                       href={`/generate?id=${report.id}`}
                       className="mt-2 py-2 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600 font-bold text-xs text-center hover:bg-indigo-100 transition-all flex items-center justify-center gap-2 group shadow-sm"
                     >
                       <Palette className="w-3 h-3 group-hover:scale-110 transition-transform" />
                       গ্রাফিক্স তৈরি করুন
                     </Link>

                   </div>
                 ))}
               </div>
             )}
          </>
        )}
      </div>

      {/* Floating Report Button */}
      <div className="fixed bottom-8 right-8 z-30">
        <Link href="/report" className="flex items-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-full font-bold shadow-2xl hover:scale-105 hover:bg-black transition-all">
          <Shield className="w-5 h-5" /> রিপোর্ট করুন
        </Link>
      </div>
    </div>
  );
}