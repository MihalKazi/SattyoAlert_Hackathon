'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import html2canvas from 'html2canvas';
import { toast } from 'react-hot-toast';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, collection, getDocs, limit, query, where } from 'firebase/firestore';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import { Download, Palette, Eye, Sparkles, CheckCircle2, Search, ChevronDown, X, Stamp, Shield, AlertTriangle } from 'lucide-react';

function GenerateContent() {
  const searchParams = useSearchParams();
  const urlId = searchParams.get('id');

  // 1. Initial State
  const [formData, setFormData] = useState({
    claim: 'নির্বাচন সংক্রান্ত কোনো তথ্য যাচাই করুন',
    status: 'false',
    verdict: 'সঠিক তথ্য জানতে আমাদের প্ল্যাটফর্ম ব্যবহার করুন।',
    source: 'SattyoAlert'
  });

  const [allFacts, setAllFacts] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('classic');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const generateRef = useRef(null);
  const dropdownRef = useRef(null);

  // 2. Click Outside logic for Dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 3. Fetch Data
  useEffect(() => {
    const fetchSpecificFact = async () => {
      if (!urlId) return;
      try {
        const docSnap = await getDoc(doc(db, 'reports', urlId));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            claim: data.claim,
            status: data.status,
            verdict: data.verdict,
            source: data.verifiedSourceUrl ? new URL(data.verifiedSourceUrl).hostname : 'SattyoAlert'
          });
        }
      } catch (err) { console.error(err); }
    };

    const fetchDropdownFacts = async () => {
      try {
        const q = query(collection(db, 'reports'), where('status', 'in', ['verified', 'false']), limit(20));
        const snap = await getDocs(q);
        setAllFacts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) { console.error(err); }
    };

    fetchSpecificFact();
    fetchDropdownFacts();
  }, [urlId]);

  const filteredOptions = allFacts.filter(fc => 
    fc.claim.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (fc) => {
    setFormData({
      claim: fc.claim,
      status: fc.status,
      verdict: fc.verdict,
      source: fc.verifiedSourceUrl ? new URL(fc.verifiedSourceUrl).hostname : 'SattyoAlert'
    });
    setSearchTerm(''); 
    setIsDropdownOpen(false); 
    toast.success('Fact Loaded');
  };

  const templates = [
    { id: 'classic', name: 'Premium Red', gradient: 'from-red-600 to-red-800', text: 'text-white' },
    { id: 'modern', name: 'Dark Truth', gradient: 'from-slate-900 to-black', text: 'text-white' },
    { id: 'minimal', name: 'Clean White', gradient: 'from-white to-slate-50', text: 'text-slate-900' },
  ];

  const downloadImage = async () => {
    if (!generateRef.current) return;
    setIsGenerating(true);
    const tid = toast.loading('Generating Official Card...');

    try {
      const canvas = await html2canvas(generateRef.current, { scale: 3, useCORS: true });
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `SattyoAlert-Verified-${Date.now()}.png`;
      link.href = url;
      link.click();
      toast.success('Ready to Share!', { id: tid });
    } catch (error) {
      toast.error('Failed', { id: tid });
    } finally {
      setIsGenerating(false);
    }
  };

  const GraphicCard = ({ isFixedSize = false }) => {
    const currentTemplate = templates.find(t => t.id === selectedTemplate) || templates[0];
    const isFalse = formData.status === 'false';

    const sizeClasses = isFixedSize 
      ? { container: 'w-[1080px] h-[1080px]', padding: 'p-[80px]', title: 'text-7xl', body: 'text-4xl', footer: 'text-3xl' }
      : { container: 'w-full aspect-square', padding: 'p-6', title: 'text-xl', body: 'text-sm', footer: 'text-xs' };

    return (
      <div className={`relative overflow-hidden flex flex-col ${sizeClasses.container} bg-gradient-to-br ${currentTemplate.gradient} ${sizeClasses.padding}`}>
        {/* Branding Overlay */}
        <div className="relative z-10 h-full flex flex-col justify-between text-white">
          <div>
            <div className="flex justify-between items-start mb-10">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-2xl shadow-lg">
                  <Shield className="w-8 h-8 text-red-600 fill-red-600" />
                </div>
                <span className={`font-black tracking-tighter ${isFixedSize ? 'text-5xl' : 'text-2xl'} ${currentTemplate.text}`}>SattyoAlert</span>
              </div>
              <div className={`${isFalse ? 'bg-red-500' : 'bg-emerald-500'} px-6 py-2 rounded-full border border-white/20 shadow-xl`}>
                 <span className="font-black uppercase tracking-widest text-xs">Official Fact Check</span>
              </div>
            </div>
            
            <h2 className={`font-black leading-[1.15] mb-8 ${sizeClasses.title} ${currentTemplate.text}`}>
              "{formData.claim}"
            </h2>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-[2rem] p-8 border border-white/20 shadow-2xl relative">
            <div className="absolute -top-4 left-8 bg-white text-slate-900 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">The Verdict</div>
            <p className={`font-bold leading-relaxed ${sizeClasses.body} ${currentTemplate.text}`}>{formData.verdict}</p>
          </div>

          <div className="flex justify-between items-end border-t border-white/20 pt-8 mt-6">
            <div>
              <p className={`font-black opacity-60 uppercase tracking-widest mb-1 ${isFixedSize ? 'text-2xl' : 'text-[10px]'} ${currentTemplate.text}`}>Verified Source</p>
              <p className={`font-black ${isFixedSize ? 'text-4xl' : 'text-sm'} ${currentTemplate.text}`}>{formData.source}</p>
            </div>
            <div className="text-right">
                <p className={`font-black opacity-60 uppercase tracking-widest mb-1 ${isFixedSize ? 'text-2xl' : 'text-[10px]'} ${currentTemplate.text}`}>Status</p>
                <div className="flex items-center gap-2">
                    {isFalse ? <X className="text-red-400" /> : <CheckCircle2 className="text-emerald-400" />}
                    <span className="font-black text-xl">{isFalse ? 'FAKE' : 'TRUE'}</span>
                </div>
            </div>
          </div>
        </div>
        
        {/* Large Decorative Icon */}
        <div className="absolute -right-20 -bottom-20 opacity-10 pointer-events-none">
           {isFalse ? <AlertTriangle className="w-[500px] h-[500px]" /> : <CheckCircle2 className="w-[500px] h-[500px]" />}
        </div>
      </div>
    );
  };

  return (
    <div className="grid lg:grid-cols-2 gap-12 items-start">
      {/* HIDDEN GENERATOR */}
      <div className="fixed top-0 left-0 pointer-events-none opacity-0 z-[-1000]">
         <div ref={generateRef}><GraphicCard isFixedSize={true} /></div>
      </div>

      {/* CONTROLS */}
      <div className="space-y-8 animate-fade-in">
        {/* Improved Search Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 block">1. Select Verified News</label>
          <div className="relative group">
            <input
              type="text"
              placeholder="Search current database..."
              value={searchTerm}
              onFocus={() => setIsDropdownOpen(true)}
              onChange={(e) => { setSearchTerm(e.target.value); setIsDropdownOpen(true); }}
              className="w-full pl-12 pr-12 py-4 bg-white border-2 border-slate-200 focus:border-red-500 rounded-2xl transition-all font-bold shadow-sm"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500" />
            <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </div>

          {isDropdownOpen && (
            <div className="absolute z-50 mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-[300px] overflow-y-auto p-2 animate-slide-up">
              {filteredOptions.length > 0 ? filteredOptions.map((fc) => (
                <div key={fc.id} onClick={() => handleSelect(fc)} className="p-4 hover:bg-red-50 rounded-xl cursor-pointer transition-colors border-b border-slate-50 last:border-0">
                  <p className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug">{fc.claim}</p>
                </div>
              )) : (
                <p className="p-4 text-center text-slate-400 font-bold">No results found</p>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 block">2. Select Card Style</label>
          <div className="grid grid-cols-3 gap-3">
            {templates.map((t) => (
              <button key={t.id} onClick={() => setSelectedTemplate(t.id)} className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${selectedTemplate === t.id ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-white hover:border-red-200'}`}>
                <Palette className={`w-5 h-5 ${selectedTemplate === t.id ? 'text-red-600' : 'text-slate-400'}`} />
                <span className="text-[10px] font-black uppercase">{t.name}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={downloadImage}
          disabled={isGenerating}
          className="w-full py-5 rounded-2xl font-black text-white bg-slate-900 hover:bg-red-600 shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 disabled:bg-slate-300"
        >
          <Download className="w-6 h-6" /> DOWNLOAD OFFICIAL GRAPHIC
        </button>

        <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
            <AlertTriangle className="text-amber-600 w-10 h-10 flex-shrink-0" />
            <p className="text-xs font-bold text-amber-800 leading-relaxed">
                Security Alert: Image uploading is disabled to protect brand integrity. Only facts verified by SattyoAlert can be converted into shareable graphics.
            </p>
        </div>
      </div>

      {/* PREVIEW */}
      <div className="sticky top-24">
        <div className="flex items-center justify-center gap-2 mb-6 text-slate-400">
          <Eye className="w-4 h-4" /> <span className="text-[10px] font-black uppercase tracking-widest">Shareable Preview</span>
        </div>
        <div className="max-w-md mx-auto shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] rounded-[2.5rem] overflow-hidden ring-1 ring-slate-200">
          <GraphicCard isFixedSize={false} />
        </div>
      </div>
    </div>
  );
}

export default function GeneratePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-12 pb-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 text-center md:text-left">
          <div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-2">Truth Cards</h2>
            <p className="text-slate-500 font-bold">Turn verified facts into high-impact social media posts.</p>
          </div>
          <div className="hidden md:flex gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse delay-75"></div>
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-150"></div>
          </div>
        </div>
        <Suspense fallback={<div className="text-center font-black">CONNECTING...</div>}>
          <GenerateContent />
        </Suspense>
      </main>
      <BottomNav />
    </div>
  );
}