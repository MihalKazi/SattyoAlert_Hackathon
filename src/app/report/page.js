'use client';

import { useState } from 'react'; // ✅ Make sure useState is imported
import Header from '@/components/layout/Header';
import ReportForm from '@/components/forms/ReportForm';
import BottomNav from '@/components/layout/BottomNav';
import { Sparkles } from 'lucide-react';

export default function ReportPage() {
  const [submittedReports, setSubmittedReports] = useState([]);

  const handleReportSubmit = (report) => {
    setSubmittedReports([report, ...submittedReports]);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50">
      {/* Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-100 via-pink-100 to-indigo-100"></div>

      {/* Blurry Geometric Shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-10 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl"></div>
      </div>

      {/* Dot Pattern */}
      <div
        className="fixed inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }}
      ></div>

      <Header />

      <main className="relative max-w-5xl mx-auto px-4 py-10 pb-24">
        {/* HEADER */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-white shadow-sm px-4 py-2 rounded-full mb-4 border border-gray-200">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-gray-700 text-sm font-semibold">Report Center</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            সন্দেহজনক তথ্য রিপোর্ট করুন
          </h2>

          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            ভুয়া বা বিভ্রান্তিকর তথ্য দেখলে আমাদের জানান, আমরা যাচাই করবো
          </p>
        </div>

        {/* INFO BOX */}
        <div className="bg-white/80 backdrop-blur-xl shadow-lg border border-gray-200 rounded-2xl p-6 mb-8 animate-slide-up">
          <p className="text-gray-800 text-sm leading-relaxed">
            <span className="font-bold">💡 গুরুত্বপূর্ণ:</span> আপনার রিপোর্ট সম্পূর্ণ গোপনীয় থাকবে। 
            কোনো ব্যক্তিগত তথ্য শেয়ার করবেন না। শুধু কনটেন্ট/পোস্ট/দাবি সংক্রান্ত তথ্য দিন।
          </p>
        </div>

        {/* MAIN FORM CARD */}
        <div className="bg-white shadow-xl border border-gray-200 rounded-3xl p-8 animate-slide-up">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            রিপোর্ট সাবমিট করুন
          </h3>

          <ReportForm onSubmit={handleReportSubmit} />
        </div>

        {/* SUBMITTED LIST */}
        {submittedReports.length > 0 && (
          <div className="mt-10 bg-white shadow-xl border border-gray-200 rounded-3xl p-8 animate-slide-up">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              আপনার জমা দেওয়া রিপোর্ট ({submittedReports.length})
            </h3>

            <div className="space-y-4">
              {submittedReports.map((r, i) => (
                <div
                  key={i}
                  className="border rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
                      যাচাইকরণের অপেক্ষায়
                    </span>
                    <span className="text-xs text-gray-500">
                      {r.timestamp}
                    </span>
                  </div>

                  <p className="font-semibold text-gray-900 mb-1">
                    {r.claim}
                  </p>

                  <p className="text-sm text-gray-700">
                    বিভাগ: {r.category}
                  </p>
                  <p className="text-sm text-gray-700">
                    গুরুত্ব: {r.urgency}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* BOTTOM NAV */}
      <BottomNav />
    </div>
  );
}
