'use client';

import { useState, useEffect, useMemo, forwardRef } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, orderBy, where, Timestamp } from 'firebase/firestore';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav'; // <--- CHANGED TO BOTTOM NAV
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css"; 
import { 
  ExternalLink, Share2, Eye, AlertTriangle, 
  CheckCircle, XCircle, Loader2, Calendar as CalendarIcon, 
  ChevronLeft, ChevronRight, Globe 
} from 'lucide-react';

export default function SummaryPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [viewMode, setViewMode] = useState('date'); 
  const [selectedDate, setSelectedDate] = useState(new Date());

  // --- DATE DISPLAY HELPERS ---

  const formatDateDisplay = (dateObj) => {
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = String(dateObj.getFullYear()).slice(-2);
    
    const today = new Date();
    const isToday = dateObj.getDate() === today.getDate() && 
                    dateObj.getMonth() === today.getMonth() && 
                    dateObj.getFullYear() === today.getFullYear();

    return isToday ? `Today - ${day}/${month}/${year}` : `${day}/${month}/${year}`;
  };

  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
    setViewMode('date');
  };

  // --- CUSTOM DATE INPUT BUTTON ---
  const CustomDateInput = forwardRef(({ value, onClick }, ref) => (
    <div 
      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg font-bold cursor-pointer border border-red-100 hover:bg-red-100 transition-colors min-w-[160px] justify-center"
      onClick={onClick}
      ref={ref}
    >
      <CalendarIcon className="w-4 h-4" />
      <span className="font-mono">{formatDateDisplay(selectedDate)}</span>
    </div>
  ));
  CustomDateInput.displayName = 'CustomDateInput';

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setReports([]); 

      try {
        let q;

        if (viewMode === 'all') {
          q = query(collection(db, 'reports'), orderBy('reviewedAt', 'desc'));
        } else {
          const start = new Date(selectedDate);
          start.setHours(0, 0, 0, 0);
          const end = new Date(selectedDate);
          end.setHours(23, 59, 59, 999);

          const startTimestamp = Timestamp.fromDate(start);
          const endTimestamp = Timestamp.fromDate(end);

          q = query(
            collection(db, 'reports'),
            where('reviewedAt', '>=', startTimestamp),
            where('reviewedAt', '<=', endTimestamp),
            orderBy('reviewedAt', 'desc')
          );
        }
        
        const snapshot = await getDocs(q);
        
        const data = snapshot.docs.map(doc => {
          const raw = doc.data();
          let reportDate = 'N/A';
          if (raw.reviewedAt?.toDate) {
             const d = raw.reviewedAt.toDate();
             const dd = String(d.getDate()).padStart(2, '0');
             const mm = String(d.getMonth() + 1).padStart(2, '0');
             const yy = String(d.getFullYear()).slice(-2);
             reportDate = `${dd}/${mm}/${yy}`;
          }

          return {
            id: doc.id,
            ...raw,
            priority: raw.urgency || 'Normal', 
            views: Math.floor(Math.random() * 5000) + 500, 
            shares: Math.floor(Math.random() * 1000) + 100,
            date: reportDate
          };
        });

        setReports(data);
      } catch (error) {
        console.error("Error fetching summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDate, viewMode]);


  const stats = useMemo(() => {
    const validReports = reports.filter(r => r.status && r.status !== 'pending');
    return {
      total: validReports.length,
      falseCount: validReports.filter(fc => fc.status === 'false').length,
      trueCount: validReports.filter(fc => fc.status === 'verified').length,
      misleadingCount: validReports.filter(fc => fc.status === 'misleading').length,
      totalViews: validReports.reduce((sum, fc) => sum + (fc.views || 0), 0),
      totalShares: validReports.reduce((sum, fc) => sum + (fc.shares || 0), 0)
    };
  }, [reports]);

  const falseClaims = reports.filter(fc => fc.status === 'false');
  const trueClaims = reports.filter(fc => fc.status === 'verified');
  const misleadingClaims = reports.filter(fc => fc.status === 'misleading');


  return (
    // Adjusted padding for BottomNav
    <div className="min-h-screen relative overflow-hidden bg-white pb-24">
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-white to-purple-50 z-0"></div>
      
      <style jsx global>{`
        .react-datepicker-wrapper { width: auto; }
        .react-datepicker {
          font-family: inherit;
          border-radius: 1rem;
          border: 1px solid #fee2e2;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .react-datepicker__header {
          background-color: #fff;
          border-bottom: 1px solid #fee2e2;
          padding-top: 1rem;
        }
        .react-datepicker__day--selected {
          background-color: #dc2626 !important;
          border-radius: 0.5rem;
        }
        .react-datepicker__day:hover {
          background-color: #fee2e2;
          border-radius: 0.5rem;
        }
        .react-datepicker__navigation { top: 15px; }
      `}</style>

      <div className="relative z-10">
        <Header />
      
        <main className="max-w-6xl mx-auto px-4 py-8">
          
          <div className="text-center mb-6 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
              {viewMode === 'all' ? 'সর্বমোট সারসংক্ষেপ' : 'দৈনিক সারসংক্ষেপ'}
            </h2>
            {viewMode === 'date' && (
              <p className="text-gray-600 font-medium font-mono tracking-wide">
                {formatDateDisplay(selectedDate)}
              </p>
            )}
          </div>

          {/* --- CONTROLS --- */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-8">
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button 
                onClick={() => setViewMode('date')}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'date' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                তারিখ অনুযায়ী
              </button>
              <button 
                onClick={() => setViewMode('all')}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'all' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                সব দেখুন (All Time)
              </button>
            </div>

            {viewMode === 'date' && (
              <div className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 relative z-20">
                <button onClick={() => changeDate(-1)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>

                <DatePicker 
                  selected={selectedDate} 
                  onChange={(date) => {
                    setViewMode('date');
                    setSelectedDate(date);
                  }}
                  customInput={<CustomDateInput />} 
                  popperPlacement="bottom-center" 
                  dateFormat="dd/MM/yy"
                  maxDate={new Date()} 
                />

                <button 
                  onClick={() => changeDate(1)}
                  disabled={new Date(selectedDate).setHours(0,0,0,0) >= new Date().setHours(0,0,0,0)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            )}
          </div>

          {/* --- CONTENT --- */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-red-600 mb-4" />
              <p className="text-gray-500 font-medium">লোড করা হচ্ছে...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-20 bg-white/60 rounded-2xl border-2 border-dashed border-gray-200">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                {viewMode === 'all' ? <Globe className="w-8 h-8 text-gray-400" /> : <CalendarIcon className="w-8 h-8 text-gray-400" />}
              </div>
              <h3 className="text-xl font-bold text-gray-700">কোনো রিপোর্ট পাওয়া যায়নি</h3>
              <p className="text-gray-500 mt-2">
                {viewMode === 'all' ? 'এখনও পর্যন্ত কোনো তথ্য যাচাই করা হয়নি।' : `${formatDateDisplay(selectedDate)} - এই তারিখে কোনো তথ্য যাচাই করা হয়নি।`}
              </p>
            </div>
          ) : (
            <div className="animate-fade-in-up">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard label="মোট যাচাই" count={stats.total} color="indigo" />
                <StatCard label="মিথ্যা দাবি" count={stats.falseCount} color="red" />
                <StatCard label="সত্য তথ্য" count={stats.trueCount} color="green" />
                <StatCard label="বিভ্রান্তিকর" count={stats.misleadingCount} color="amber" />
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                 <EngagementCard label="মোট ভিউ" count={stats.totalViews} icon={<Eye className="w-5 h-5" />} color="purple" />
                 <EngagementCard label="মোট শেয়ার" count={stats.totalShares} icon={<Share2 className="w-5 h-5" />} color="blue" />
              </div>

              {/* LISTS */}
              {falseClaims.length > 0 && (
                <Section title="মিথ্যা দাবি (Verified False)" icon={<XCircle className="w-6 h-6 text-red-600" />} color="red">
                  {falseClaims.map(report => <ReportCard key={report.id} report={report} color="red" />)}
                </Section>
              )}

              {trueClaims.length > 0 && (
                <Section title="সত্য তথ্য (Verified True)" icon={<CheckCircle className="w-6 h-6 text-green-600" />} color="green">
                  {trueClaims.map(report => <ReportCard key={report.id} report={report} color="green" />)}
                </Section>
              )}

              {misleadingClaims.length > 0 && (
                <Section title="বিভ্রান্তিকর (Misleading)" icon={<AlertTriangle className="w-6 h-6 text-amber-500" />} color="amber">
                  {misleadingClaims.map(report => <ReportCard key={report.id} report={report} color="amber" />)}
                </Section>
              )}

              <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl p-6 text-center shadow-lg mt-12">
                <p className="text-lg mb-2">
                  <span className="font-bold">
                     {viewMode === 'all' 
                       ? `এখন পর্যন্ত সর্বমোট ${stats.total}টি দাবি যাচাই করা হয়েছে` 
                       : `${formatDateDisplay(selectedDate)} - এই তারিখে মোট ${stats.total}টি দাবি যাচাই করা হয়েছে`
                     }
                  </span>
                </p>
              </div>
            </div>
          )}
        </main>
        
        {/* --- USING BOTTOM NAV HERE --- */}
        <BottomNav />
      </div>
    </div>
  );
}

// --- SUB COMPONENTS (UNCHANGED) ---
const StatCard = ({ label, count, color }) => (
  <div className={`bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm border border-${color}-100`}>
    <div className={`text-3xl font-bold text-${color}-600 mb-1`}>{count}</div>
    <p className="text-xs text-gray-600 font-semibold">{label}</p>
  </div>
);

const EngagementCard = ({ label, count, icon, color }) => (
  <div className={`bg-white/90 rounded-xl p-5 border border-${color}-100 shadow-sm flex items-center justify-between`}>
    <div>
      <p className="text-2xl font-bold text-gray-900">{count.toLocaleString()}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
    <div className={`w-10 h-10 bg-${color}-100 rounded-full flex items-center justify-center text-${color}-600`}>
      {icon}
    </div>
  </div>
);

const Section = ({ title, icon, children, color }) => (
  <div className="mb-8">
    <div className="flex items-center gap-2 mb-4 px-1">
      {icon}
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

const ReportCard = ({ report, color }) => (
  <a 
    href={report.verifiedSourceUrl || report.sourceUrl || '#'}
    target="_blank"
    rel="noopener noreferrer"
    className={`block group relative bg-white rounded-xl border-l-4 border-${color}-500 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-5`}
  >
    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <ExternalLink className="w-5 h-5 text-gray-400" />
    </div>
    <div className="flex items-start justify-between mb-3 pr-6">
        <h4 className={`font-bold text-gray-900 text-lg leading-snug group-hover:text-${color}-700 transition-colors`}>
        {report.claim}
        </h4>
    </div>
    <p className={`text-sm text-gray-600 mb-3 bg-${color}-50 p-3 rounded-lg`}>
        <span className={`font-bold text-${color}-700`}>ফলাফল: </span> {report.verdict}
    </p>
    <div className="flex items-center justify-between text-xs text-gray-500 mt-2 border-t pt-3">
        <span className="font-mono">{report.date}</span>
        <div className="flex gap-3">
           <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {report.views}</span>
        </div>
    </div>
  </a>
);