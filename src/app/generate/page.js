'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import html2canvas from 'html2canvas';
import { toast } from 'react-hot-toast';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav'; 
import { factChecks, getStatusName } from '@/data/sampleFactChecks'; 
import { Download, Palette, Eye, Sparkles, CheckCircle2, Search, ChevronDown } from 'lucide-react';

function GenerateContent() {
  const searchParams = useSearchParams();
  const urlId = searchParams.get('id');

  // Initialize form data
  const [formData, setFormData] = useState({
    claim: factChecks[0]?.claim || '',
    status: factChecks[0]?.status || 'false',
    verdict: factChecks[0]?.verdict || '',
    source: factChecks[0]?.source || ''
  });

  // Load data from URL ID or Default to first item
  useEffect(() => {
    if (urlId) {
      const found = factChecks.find(f => f.id.toString() === urlId);
      if (found) {
        setFormData({
          claim: found.claim,
          status: found.status,
          verdict: found.verdict,
          source: found.source
        });
        toast.success('তথ্য লোড হয়েছে!');
      }
    }
  }, [urlId]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('classic');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Ref for the HIDDEN fixed-size container
  const generateRef = useRef(null); 

  const filteredOptions = factChecks.filter(fc => 
    fc.claim.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (fc) => {
    setFormData({
      claim: fc.claim,
      status: fc.status,
      verdict: fc.verdict,
      source: fc.source
    });
    setSearchTerm(''); 
    setIsDropdownOpen(false); 
    toast.success('তথ্য নির্বাচন করা হয়েছে!');
  };

  const templates = [
    { id: 'classic', name: 'Classic', gradient: 'from-indigo-600 to-blue-700', preview: 'from-indigo-600 to-blue-600' },
    { id: 'modern', name: 'Modern', gradient: 'from-slate-700 to-slate-900', preview: 'from-slate-700 to-slate-800' },
    { id: 'minimal', name: 'Minimal', gradient: 'from-gray-800 to-gray-900', preview: 'from-gray-700 to-gray-900' }
  ];

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  const downloadImage = async () => {
    if (!generateRef.current) return; // Use the hidden ref
    setIsGenerating(true);
    toast.loading('তৈরি হচ্ছে...', { id: 'gen' });

    try {
      // Wait a moment for fonts/styles
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Capture the FIXED size container
      const canvas = await html2canvas(generateRef.current, { 
        scale: 2, // High resolution
        backgroundColor: null,
        logging: false,
        useCORS: true
      });
      
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `sattyoalert-${Date.now()}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        toast.success('ডাউনলোড সম্পন্ন!', { id: 'gen' });
        setIsGenerating(false);
      });
    } catch (error) {
      console.error(error);
      toast.error('সমস্যা হয়েছে', { id: 'gen' });
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      
      {/* --- HIDDEN CONTAINER FOR GENERATION (Fixed 1080x1080 equivalent) --- */}
      <div className="fixed top-0 left-0 pointer-events-none opacity-0 z-[-1000] overflow-hidden">
         <div 
            ref={generateRef}
            className={`w-[1080px] h-[1080px] flex flex-col justify-between p-[80px] bg-gradient-to-br ${selectedTemplateData.gradient}`}
            style={{ fontFamily: 'Hind Siliguri, sans-serif' }}
         >
            <div>
              {/* Status Badge */}
              <div className="mb-12">
                <span className={`inline-block px-8 py-4 rounded-full text-4xl font-bold shadow-xl bg-white ${
                  formData.status === 'false' ? 'text-red-600' : 
                  formData.status === 'true' ? 'text-green-600' : 'text-amber-600'
                }`}>
                  {getStatusName(formData.status)}
                </span>
              </div>

              {/* Claim */}
              <h2 className="text-6xl font-bold text-white mb-10 leading-tight drop-shadow-xl">
                {formData.claim}
              </h2>

              {/* Verdict */}
              <p className="text-white/95 text-4xl leading-relaxed drop-shadow-lg font-medium">
                {formData.verdict}
              </p>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-10 border-t-4 border-white/30 flex justify-between items-center text-white">
              <div>
                <p className="text-5xl font-bold mb-2">SattyoAlert</p>
                <p className="text-2xl opacity-90 font-medium tracking-wide">আগে সত্য জানো বাংলাদেশ</p>
              </div>
              <div className="text-right">
                <p className="text-2xl opacity-80 mb-1">যাচাইকারী</p>
                <p className="text-3xl font-bold">{formData.source}</p>
              </div>
            </div>
         </div>
      </div>

      {/* LEFT: CONTROLS */}
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200 animate-slide-up">
        
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white"><Palette className="w-5 h-5"/></div>
          <h3 className="text-2xl font-bold text-gray-900">তথ্য নির্বাচন করুন</h3>
        </div>

        {/* --- SEARCHABLE DROPDOWN --- */}
        <div className="mb-8 relative">
          <label className="text-sm font-bold text-gray-700 mb-2 block">রিপোর্ট খুঁজুন</label>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="কীওয়ার্ড দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:outline-none transition-all"
            />
            <div 
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {isDropdownOpen && (
            <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((fc) => (
                  <div
                    key={fc.id}
                    onClick={() => handleSelect(fc)}
                    className="p-3 hover:bg-indigo-50 cursor-pointer border-b border-gray-100 last:border-0 transition-colors"
                  >
                    <p className="text-sm font-bold text-gray-900 line-clamp-1">{fc.claim}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${fc.status === 'false' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {getStatusName(fc.status)}
                      </span>
                      <span className="text-xs text-gray-500">{fc.source}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500 text-sm">কোনো ফলাফল পাওয়া যায়নি</div>
              )}
            </div>
          )}
        </div>

        {/* Read-Only Preview */}
        <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-xs font-bold text-gray-500 uppercase mb-1">নির্বাচিত দাবি</p>
          <p className="text-gray-800 font-medium mb-3">{formData.claim}</p>
          <div className="flex gap-4">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase mb-1">সত্যতা</p>
              <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                formData.status === 'false' ? 'bg-red-100 text-red-700' :
                formData.status === 'true' ? 'bg-green-100 text-green-700' :
                'bg-amber-100 text-amber-700'
              }`}>
                {getStatusName(formData.status)}
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase mb-1">সূত্র</p>
              <span className="text-sm font-bold text-gray-700">{formData.source}</span>
            </div>
          </div>
        </div>

        {/* Templates */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-3">টেমপ্লেট নির্বাচন করুন</label>
          <div className="grid grid-cols-3 gap-3">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTemplate(t.id)}
                className={`p-1 rounded-xl border-2 transition-all ${selectedTemplate === t.id ? 'border-indigo-600 scale-105' : 'border-transparent hover:border-gray-300'}`}
              >
                <div className={`h-16 rounded-lg bg-gradient-to-br ${t.preview}`}></div>
                <p className="text-xs font-bold text-center mt-1 text-gray-600">{t.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Download Button */}
        <button
          onClick={downloadImage}
          disabled={isGenerating}
          className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${
            isGenerating ? 'bg-gray-400' : 'bg-gradient-to-r from-green-600 to-green-700 hover:shadow-xl'
          }`}
        >
          {isGenerating ? <div className="spinner"></div> : <Download className="w-5 h-5" />}
          {isGenerating ? 'তৈরি হচ্ছে...' : 'ডাউনলোড করুন'}
        </button>
      </div>

      {/* RIGHT: PREVIEW (Visual Only - Does Not Affect Download) */}
      <div className="bg-white rounded-3xl p-8 flex items-center justify-center border border-gray-200 shadow-xl">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center gap-2 mb-6 text-gray-500">
            <Eye className="w-5 h-5" /> <span className="text-sm font-bold">লাইভ প্রিভিউ</span>
          </div>
          
          {/* Responsive Preview Container */}
          <div 
            className={`w-full aspect-square rounded-3xl shadow-2xl overflow-hidden bg-gradient-to-br ${selectedTemplateData.gradient} p-8 flex flex-col`}
            style={{ fontFamily: 'Hind Siliguri, sans-serif' }}
          >
            {/* Status Badge */}
            <div className="mb-6">
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold shadow-lg bg-white ${
                formData.status === 'false' ? 'text-red-600' : 
                formData.status === 'true' ? 'text-green-600' : 'text-amber-600'
              }`}>
                {getStatusName(formData.status)}
              </span>
            </div>

            {/* Claim Text */}
            <h2 className="text-2xl font-bold text-white mb-4 leading-tight drop-shadow-md">
              {formData.claim}
            </h2>

            {/* Verdict Text */}
            <p className="text-white/90 text-sm leading-relaxed mb-auto">
              {formData.verdict}
            </p>

            {/* --- FOOTER SECTION --- */}
            <div className="mt-6 pt-6 border-t-2 border-white/30 flex justify-between items-center text-white">
              <div>
                <p className="text-lg font-bold">SattyoAlert</p>
                <p className="text-xs opacity-90 font-medium tracking-wide">আগে সত্য জানো বাংলাদেশ</p> 
              </div>
              <div className="text-right">
                <p className="text-xs opacity-80">যাচাইকারী</p>
                <p className="text-sm font-semibold">{formData.source}</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-center mt-4 text-gray-400 flex justify-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> অফিশিয়াল ফরম্যাট (High Quality Export)
          </p>
        </div>
      </div>
    </div>
  );
}

// Wrapper to handle Suspense for useSearchParams
export default function GeneratePage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50">
      <div className="fixed inset-0 bg-gradient-to-br from-slate-100 via-indigo-50 to-blue-100"></div>
      <div className="fixed inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`, backgroundSize: '30px 30px' }}></div>
      <Header />
      <main className="relative max-w-7xl mx-auto px-4 py-8 pb-24">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-white shadow-sm px-4 py-2 rounded-full mb-4 border border-gray-200">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-gray-700 text-sm font-semibold">Graphics Studio</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-3">শেয়ারযোগ্য গ্রাফিক্স তৈরি করুন</h2>
        </div>
        
        <Suspense fallback={<div className="text-center py-20">লোড হচ্ছে...</div>}>
          <GenerateContent />
        </Suspense>
      </main>
      
      {/* ✅ ADDED BOTTOM NAV HERE */}
      <BottomNav />
    </div>
  );
}