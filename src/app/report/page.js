'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import ReportForm from '@/components/forms/ReportForm';

export default function ReportPage() {
  const [submittedReports, setSubmittedReports] = useState([]);

  const handleReportSubmit = (report) => {
    // Add new report to the list
    setSubmittedReports([report, ...submittedReports]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-800">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8 pb-24">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-2">
            সন্দেহজনক তথ্য রিপোর্ট করুন
          </h2>
          <p className="text-purple-100 text-lg">
            আপনার দেখা ভুয়া বা সন্দেহজনক তথ্য আমাদের জানান
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800 text-sm">
            <span className="font-bold">💡 মনে রাখবেন:</span> আপনার রিপোর্ট সম্পূর্ণ গোপনীয় থাকবে। 
            আমরা দাবিটি যাচাই করব, ব্যক্তিকে নয়। কোনো ব্যক্তিগত তথ্য শেয়ার করবেন না।
          </p>
        </div>

        {/* Report Form */}
        <ReportForm onSubmit={handleReportSubmit} />

        {/* Submitted Reports Preview (for demo) */}
        {submittedReports.length > 0 && (
          <div className="mt-8 bg-white rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              আপনার জমা দেওয়া রিপোর্ট ({submittedReports.length})
            </h3>
            <div className="space-y-4">
              {submittedReports.map((report, index) => (
                <div key={index} className="border-2 border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
                      যাচাইকরণের অপেক্ষায়
                    </span>
                    <span className="text-xs text-gray-500">{report.timestamp}</span>
                  </div>
                  <p className="font-semibold text-gray-900 mb-1">{report.claim}</p>
                  <p className="text-sm text-gray-600">বিভাগ: {report.category}</p>
                  <p className="text-sm text-gray-600">গুরুত্ব: {report.urgency}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}