import { useState } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { PlusCircle, Save, XCircle } from 'lucide-react';

export default function AddReportForm({ userEmail, onReportAdded }) {
  const [isOpen, setIsOpen] = useState(false);
  const [claim, setClaim] = useState('');
  const [verdict, setVerdict] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [status, setStatus] = useState('verified');
  const [category, setCategory] = useState('election');
  const [priority, setPriority] = useState('Normal');
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 'election', label: 'নির্বাচন' },
    { value: 'religious', label: 'ধর্মীয়' },
    { value: 'scam', label: 'স্ক্যাম' },
    { value: 'health', label: 'স্বাস্থ্য' },
    { value: 'other', label: 'অন্যান্য' },
  ];

  const statuses = [
    { value: 'verified', label: '✅ সত্য যাচাই' },
    { value: 'false', label: '❌ মিথ্যা প্রমাণ' },
    { value: 'misleading', label: '⚠️ বিভ্রান্তিকর' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!claim || !verdict || !sourceUrl || !status) {
      toast.error('All main fields are required!');
      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, 'reports'), {
        claim: claim,
        verdict: verdict,
        status: status,
        category: category,
        urgency: priority,
        verifiedSourceUrl: sourceUrl,
        sourceUrl: sourceUrl, // Use the verified source as the original source for admin reports
        submittedAt: new Date(), // Use submittedAt to track creation date
        reviewedAt: new Date(),
        reviewedBy: userEmail,
        isManual: true, // Flag this report as manually added by an admin
      });
      
      toast.success('New report added successfully!');
      
      // Reset form and close
      setClaim('');
      setVerdict('');
      setSourceUrl('');
      setCategory('election');
      setStatus('verified');
      setPriority('Normal');
      setIsOpen(false);
      
      // Notify parent component (AdminReportsPage) to refresh the list
      onReportAdded();

    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error('Failed to add report.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-green-700 transition-colors shadow-lg"
      >
        <PlusCircle className="w-5 h-5" /> ম্যানুয়ালি রিপোর্ট যোগ করুন
      </button>
    );
  }

  return (
    <div className="bg-white border-2 border-green-300 rounded-2xl p-6 shadow-xl mb-8">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-green-700 flex items-center gap-2">
          <PlusCircle className="w-6 h-6" /> নতুন রিপোর্ট তৈরি করুন
        </h3>
        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
          <XCircle className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Claim/Title */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">দাবি/শিরোনাম (Claim/Title)</label>
          <input
            type="text"
            value={claim}
            onChange={(e) => setClaim(e.target.value)}
            className="w-full p-2 border rounded-lg text-base font-bold font-bengali focus:ring-green-500 focus:border-green-500"
            placeholder="ফ্যাক্ট-চেক করা দরকার এমন দাবিটি লিখুন"
            required
          />
        </div>

        {/* Verdict */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">বিস্তারিত রায়/ব্যাখ্যা (Detailed Verdict/Explanation)</label>
          <textarea
            value={verdict}
            onChange={(e) => setVerdict(e.target.value)}
            className="w-full p-2 border rounded-lg text-sm min-h-[100px] font-bengali focus:ring-green-500 focus:border-green-500"
            placeholder="এই দাবিটি কেন সত্য, মিথ্যা বা বিভ্রান্তিকর তা বিস্তারিত লিখুন"
            required
          />
        </div>

        {/* Source URL */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">প্রমাণের লিংক (Verified Source Link)</label>
          <input
            type="url"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            className="w-full p-2 border rounded-lg text-xs focus:ring-green-500 focus:border-green-500"
            placeholder="https://verified-news-site.com/..."
            required
          />
        </div>

        {/* Status Dropdown */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">ফলাফল (Status)</label>
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border rounded-lg text-sm font-bold focus:ring-green-500 focus:border-green-500"
          >
            {statuses.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">ক্যাটাগরি (Category)</label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded-lg text-sm font-bold focus:ring-green-500 focus:border-green-500"
          >
            {categories.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        
        {/* Priority Dropdown (Optional) */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">অগ্রাধিকার (Priority)</label>
          <select 
            value={priority} 
            onChange={(e) => setPriority(e.target.value)}
            className="w-full p-2 border rounded-lg text-sm font-bold focus:ring-green-500 focus:border-green-500"
          >
            <option value="Normal">Normal</option>
            <option value="High">High (জরুরি 🔥)</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-600 text-white rounded-lg font-bold text-lg flex justify-center items-center gap-2 hover:bg-green-700 transition-colors disabled:bg-gray-400"
          >
            {loading ? (
              <Save className="w-5 h-5 animate-pulse" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {loading ? 'সংরক্ষণ করা হচ্ছে...' : 'রিপোর্ট সংরক্ষণ করুন'}
          </button>
        </div>
      </form>
    </div>
  );
}