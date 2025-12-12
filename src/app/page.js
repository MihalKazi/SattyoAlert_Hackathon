'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, where, limit, doc, getDoc } from 'firebase/firestore'; 
import Link from 'next/link';
import { Search, Palette, X, TrendingUp } from 'lucide-react';

// --- COMPONENT IMPORTS ---
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav'; 
import FactCheckCard from '@/components/fact-checks/FactCheckCard'; 
import CategoryFilter from '@/components/fact-checks/CategoryFilter'; 
import SkeletonCard from '@/components/ui/SkeletonCard'; 
import NewsTicker from '@/components/ui/NewsTicker'; 

export default function Home() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentCategory, setCurrentCategory] = useState('all');

  const [tickerItems, setTickerItems] = useState([]); 
  const [trendingTags, setTrendingTags] = useState(['নির্বাচন', 'বন্যা', 'শিক্ষা']); 
  const [statsOffset, setStatsOffset] = useState(0); 

  const getDomain = (url) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch (e) {
      return 'FactCheck';
    }
  };

  // Helper: Map English categories to Bengali safely
  const getBnCategory = (cat) => {
    if (!cat) return '';
    // Ensure we match regardless of case
    const lowerCat = cat.toLowerCase();
    
    const map = {
      'election': 'নির্বাচন',
      'religious': 'ধর্মীয়',
      'scam': 'স্ক্যাম',
      'health': 'স্বাস্থ্য',
      'political': 'রাজনীতি',
      'education': 'শিক্ষা',
      'sports': 'খেলাধুলা',
      'international': 'আন্তর্জাতিক'
    };
    return map[lowerCat] || '';
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. FETCH REPORTS
        const q = query(
          collection(db, 'reports'),
          where('status', 'in', ['verified', 'false', 'misleading']),
          limit(50)
        );
        const querySnapshot = await getDocs(q);
        const data = [];
        
        querySnapshot.forEach((doc) => {
          const rawData = doc.data();
          
          // --- CRITICAL FIX: NORMALIZE CATEGORY ---
          // Convert category to lowercase immediately so filters always work
          // 'Election' -> 'election'
          const normalizedCategory = (rawData.category || 'other').toLowerCase();

          data.push({
            id: doc.id,
            ...rawData,
            category: normalizedCategory, // Store the fixed category
            source: getDomain(rawData.verifiedSourceUrl || rawData.sourceUrl),
            date: rawData.reviewedAt, 
            views: Math.floor(Math.random() * 5000) + 500,
            shares: Math.floor(Math.random() * 1000) + 100
          });
        });
        
        data.sort((a, b) => (b.date?.toDate?.() || 0) - (a.date?.toDate?.() || 0));
        setReports(data);

        // 2. FETCH SETTINGS
        const docRef = doc(db, "settings", "public_config");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const settings = docSnap.data();
          if (settings.ticker_messages) setTickerItems(settings.ticker_messages);
          if (settings.trending_tags) setTrendingTags(settings.trending_tags);
          if (settings.stats_offset) setStatsOffset(Number(settings.stats_offset));
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- SMART FILTER LOGIC ---
  const filteredReports = reports.filter(r => {
    // 1. Category Button Filter (Exact match now works because both are lowercase)
    const matchesCategory = currentCategory === 'all' || r.category === currentCategory;
    
    // 2. Search Text Filter
    const q = searchTerm.toLowerCase().trim();
    
    if (!q) return matchesCategory; // If no search, just return category matches

    // Get the Bengali name for search matching
    const categoryBn = getBnCategory(r.category);

    const matchesSearch = 
      (r.claim && r.claim.toLowerCase().includes(q)) ||       
      (r.verdict && r.verdict.toLowerCase().includes(q)) ||     
      (r.source && r.source.toLowerCase().includes(q)) ||      
      (r.category && r.category.includes(q)) ||    // Matches "election"
      (categoryBn && categoryBn.includes(q));      // Matches "নির্বাচন"

    return matchesCategory && matchesSearch;
  });

  // Calculate Stats
  const totalCount = reports.length + statsOffset;
  const falseCount = reports.filter(r => r.status === 'false').length + Math.floor(statsOffset * 0.4);
  const trueCount = reports.filter(r => r.status === 'verified').length + Math.floor(statsOffset * 0.6);

  return (
    <div className="min-h-screen bg-slate-50 pb-32 font-sans relative"> 
      <Header />
      
      {/* 1. DYNAMIC NEWS TICKER */}
      {tickerItems.length > 0 && <NewsTicker items={tickerItems} />}

      {/* 2. HERO SECTION */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm pt-6 pb-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-4">
            
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
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-100 border-none focus:ring-2 focus:ring-red-500 text-sm font-medium transition-all placeholder:text-slate-400 shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-200 transition-colors">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 items-center text-sm animate-fade-in">
            <span className="text-slate-500 font-medium flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> জনপ্রিয়:
            </span>
            {trendingTags.map((tag) => (
              <button 
                key={tag}
                onClick={() => setSearchTerm(tag)} 
                className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-slate-600 hover:border-red-400 hover:text-red-600 hover:bg-white transition-all text-xs font-bold shadow-sm"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* 3. LIVE STATS DASHBOARD */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
         <div className="grid grid-cols-3 gap-2 md:gap-4 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="text-center border-r border-slate-100">
              <p className="text-2xl md:text-3xl font-black text-slate-900">
                {loading ? '...' : totalCount.toLocaleString()}
              </p>
              <p className="text-[10px] md:text-xs text-slate-500 uppercase tracking-wider font-bold">মোট যাচাই</p>
            </div>
            <div className="text-center border-r border-slate-100">
              <p className="text-2xl md:text-3xl font-black text-red-600">
                {loading ? '...' : falseCount.toLocaleString()}
              </p>
              <p className="text-[10px] md:text-xs text-red-500 uppercase tracking-wider font-bold">মিথ্যা প্রমাণ</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-black text-green-600">
                {loading ? '...' : trueCount.toLocaleString()}
              </p>
              <p className="text-[10px] md:text-xs text-green-500 uppercase tracking-wider font-bold">সত্য তথ্য</p>
            </div>
         </div>
      </div>
      
      {/* 4. CATEGORY FILTER */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <CategoryFilter currentCategory={currentCategory} onCategoryChange={setCurrentCategory} />
      </div>

      {/* 5. MAIN FEED GRID */}
      <div className="max-w-7xl mx-auto px-4">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <>
             {filteredReports.length === 0 ? (
               <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                 <p className="text-slate-400 font-medium">আপনার খোঁজা ফলাফল পাওয়া যায়নি।</p>
                 <button 
                    onClick={() => setSearchTerm('')} 
                    className="mt-4 text-red-600 font-bold hover:underline"
                 >
                    সব দেখুন
                 </button>
               </div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {filteredReports.map((report) => (
                   <div key={report.id} className="flex flex-col animate-fade-in-up h-full">
                     
                     <FactCheckCard factCheck={report} />
                     
                     <Link 
                       href={`/generate?id=${report.id}`}
                       className="mt-3 py-2.5 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600 font-bold text-xs text-center hover:bg-indigo-100 hover:border-indigo-200 transition-all flex items-center justify-center gap-2 group shadow-sm active:scale-95"
                     >
                       <Palette className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                       সোশ্যাল মিডিয়া গ্রাফিক্স তৈরি করুন
                     </Link>

                   </div>
                 ))}
               </div>
             )}
          </>
        )}
      </div>

      {/* 6. FLOATING NAV */}
      <BottomNav />
    </div>
  ); 
}