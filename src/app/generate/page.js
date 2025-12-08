'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import html2canvas from 'html2canvas';
import { toast } from 'react-hot-toast';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import { factChecks, getStatusName } from '@/data/sampleFactChecks'; 
import { Download, Palette, Eye, Sparkles, CheckCircle2, Search, ChevronDown, ImagePlus, X, Stamp } from 'lucide-react';

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

  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('classic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [bgImage, setBgImage] = useState(null);
  
  const previewRef = useRef(null);
  const generateRef = useRef(null);

  useEffect(() => {
    if (urlId) {
      const found = factChecks.find(f => f.id.toString() === urlId);
      if (found) {
        setFormData({ ...found });
        toast.success('Fact loaded!');
      }
    }
  }, [urlId]);

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
    toast.success('Selected!');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBgImage(reader.result);
        setSelectedTemplate('meme'); // Auto-switch to Meme mode on upload
      };
      reader.readAsDataURL(file);
    }
  };

  const templates = [
    { id: 'classic', name: 'Classic', gradient: 'from-indigo-600 to-blue-700', text: 'text-white' },
    { id: 'modern', name: 'Modern', gradient: 'from-slate-800 to-black', text: 'text-white' },
    { id: 'minimal', name: 'Minimal', gradient: 'from-white to-gray-100', text: 'text-gray-900' },
    { id: 'meme', name: '🔥 Meme Mode', gradient: 'bg-black', text: 'text-white' }
  ];

  const downloadImage = async () => {
    if (!generateRef.current) return;
    setIsGenerating(true);
    toast.loading('Generating Meme...', { id: 'gen' });

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const canvas = await html2canvas(generateRef.current, { scale: 2, backgroundColor: null, useCORS: true });
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `sattyoalert-meme-${Date.now()}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        toast.success('Downloaded!', { id: 'gen' });
        setIsGenerating(false);
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed', { id: 'gen' });
      setIsGenerating(false);
    }
  };

  // --- THE GRAPHIC CARD COMPONENT ---
  const GraphicCard = ({ isFixedSize = false }) => {
    const isMeme = selectedTemplate === 'meme';
    const currentTemplate = templates.find(t => t.id === selectedTemplate);

    // Dynamic Sizing
    const sizeClasses = isFixedSize 
      ? { container: 'w-[1080px] h-[1080px]', padding: 'p-[60px]', title: 'text-6xl', body: 'text-4xl', footer: 'text-3xl' }
      : { container: 'w-full aspect-square', padding: 'p-6', title: 'text-xl', body: 'text-sm', footer: 'text-xs' };

    return (
      <div 
        className={`relative overflow-hidden flex flex-col font-bengali
          ${sizeClasses.container} 
          ${isMeme ? 'bg-black' : `bg-gradient-to-br ${currentTemplate.gradient} ${sizeClasses.padding}`}
        `}
      >
        {/* === MEME LAYOUT === */}
        {isMeme ? (
          <>
            {/* Top Bar (The Claim) */}
            <div className="bg-black text-white text-center p-6 border-b-4 border-red-600 z-20">
              <p className={`font-bold uppercase tracking-wide text-red-500 mb-2 ${isFixedSize ? 'text-3xl' : 'text-xs'}`}>
                দাবি (Claim)
              </p>
              <h2 className={`font-bold leading-tight ${isFixedSize ? 'text-5xl' : 'text-lg'}`}>
                "{formData.claim}"
              </h2>
            </div>

            {/* Middle (Image) */}
            <div className="flex-1 relative bg-gray-900 flex items-center justify-center overflow-hidden">
              {bgImage ? (
                <div 
                  className="absolute inset-0 bg-contain bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${bgImage})` }}
                />
              ) : (
                <p className="text-gray-600 font-bold opacity-30 uppercase text-4xl -rotate-12">No Image Uploaded</p>
              )}
              
              {/* STAMP OVERLAY */}
              <div className={`absolute border-8 rounded-lg font-black uppercase tracking-widest opacity-80 rotate-[-15deg] flex items-center justify-center backdrop-blur-sm
                ${formData.status === 'false' ? 'border-red-600 text-red-600 bg-red-100/10' : 'border-green-600 text-green-600 bg-green-100/10'}
                ${isFixedSize ? 'w-[600px] h-[200px] text-8xl border-[12px]' : 'w-[200px] h-[60px] text-2xl border-4'}
              `}>
                {formData.status === 'false' ? 'FAKE NEWS' : 'VERIFIED'}
              </div>
            </div>

            {/* Bottom Bar (The Truth) */}
            <div className="bg-black text-white text-center p-6 border-t-4 border-green-600 z-20">
              <p className={`font-bold uppercase tracking-wide text-green-500 mb-2 ${isFixedSize ? 'text-3xl' : 'text-xs'}`}>
                সত্য (Fact)
              </p>
              <p className={`font-medium leading-relaxed ${isFixedSize ? 'text-4xl' : 'text-sm'}`}>
                {formData.verdict}
              </p>
              
              <div className={`mt-4 pt-4 border-t border-gray-800 flex justify-center items-center gap-2 text-gray-500 font-mono ${isFixedSize ? 'text-2xl' : 'text-[10px]'}`}>
                <Sparkles className={isFixedSize ? 'w-6 h-6' : 'w-3 h-3'} />
                Verified by SattyoAlert
              </div>
            </div>
          </>
        ) : (
          /* === STANDARD LAYOUT (Classic/Modern) === */
          <>
            <div className={`relative z-10 h-full flex flex-col justify-between ${currentTemplate.text}`}>
              <div>
                <span className={`inline-block font-bold shadow-lg 
                  ${isFixedSize ? 'px-8 py-4 text-4xl rounded-full' : 'px-4 py-2 text-sm rounded-full'}
                  ${formData.status === 'false' ? 'bg-red-600 text-white' : 
                    formData.status === 'true' ? 'bg-green-600 text-white' : 'bg-amber-500 text-white'}
                `}>
                  {getStatusName(formData.status)}
                </span>
                <h2 className={`font-bold leading-tight mt-6 ${sizeClasses.title}`}>
                  {formData.claim}
                </h2>
              </div>

              <div className={`border-l-4 border-white/50 pl-6 ${isFixedSize ? 'border-l-8 pl-10' : ''}`}>
                <p className={`font-medium leading-relaxed opacity-95 ${sizeClasses.body}`}>
                  {formData.verdict}
                </p>
              </div>

              <div className={`flex justify-between items-end border-t border-white/30 pt-6 ${isFixedSize ? 'pt-10 border-t-4' : ''}`}>
                <div>
                  <p className={`font-bold ${sizeClasses.footer}`}>SattyoAlert</p>
                  <p className={`opacity-80 ${isFixedSize ? 'text-2xl' : 'text-xs'}`}>সত্য জানুন, নিরাপদ থাকুন</p>
                </div>
                <div className="text-right">
                  <p className={`opacity-80 ${isFixedSize ? 'text-2xl' : 'text-xs'}`}>Source</p>
                  <p className={`font-bold ${isFixedSize ? 'text-3xl' : 'text-sm'}`}>{formData.source}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* HIDDEN GENERATOR (Fixed 1080px) */}
      <div className="fixed top-0 left-0 pointer-events-none opacity-0 z-[-1000]">
         <div ref={generateRef}>
            <GraphicCard isFixedSize={true} />
         </div>
      </div>

      {/* CONTROLS */}
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200 animate-slide-up">
        {/* Search */}
        <div className="mb-8 relative">
          <label className="text-sm font-bold text-gray-700 mb-2 block">Find Fact Check</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search claims..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setIsDropdownOpen(true); }}
              className="w-full pl-4 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:outline-none transition-all"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          {isDropdownOpen && (
            <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
              {filteredOptions.map((fc) => (
                <div key={fc.id} onClick={() => handleSelect(fc)} className="p-3 hover:bg-indigo-50 cursor-pointer border-b border-gray-100">
                  <p className="text-sm font-bold text-gray-900 line-clamp-1">{fc.claim}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Templates */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-3">Select Style</label>
          <div className="grid grid-cols-2 gap-3">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTemplate(t.id)}
                className={`p-3 rounded-xl border-2 transition-all flex items-center gap-2 ${selectedTemplate === t.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}
              >
                {t.id === 'meme' ? <Stamp className="w-4 h-4 text-red-600" /> : <Palette className="w-4 h-4 text-gray-500" />}
                <span className="text-sm font-bold text-gray-700">{t.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Upload (Only visible for Meme Mode) */}
        {selectedTemplate === 'meme' && (
          <div className="mb-6 animate-fade-in">
            <label className="block text-sm font-bold text-gray-700 mb-3">Upload Fake News Screenshot</label>
            <div className="flex gap-4 items-center">
              <label className="flex-1 cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center hover:border-indigo-500 hover:bg-indigo-50 transition-all group bg-gray-50">
                <ImagePlus className="w-6 h-6 text-gray-400 group-hover:text-indigo-600 mb-2" />
                <span className="text-xs text-gray-500 font-medium">Click to Upload</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
              
              {bgImage && (
                <button onClick={() => setBgImage(null)} className="p-4 rounded-xl border-2 border-red-100 bg-red-50 text-red-600 hover:bg-red-100 transition-all">
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
        )}

        <button
          onClick={downloadImage}
          disabled={isGenerating}
          className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${
            isGenerating ? 'bg-gray-400' : 'bg-gradient-to-r from-green-600 to-green-700 hover:shadow-xl'
          }`}
        >
          {isGenerating ? <div className="spinner"></div> : <Download className="w-5 h-5" />}
          {isGenerating ? 'Generating...' : 'Download Graphic'}
        </button>
      </div>

      {/* PREVIEW */}
      <div className="bg-gray-100 rounded-3xl p-8 flex items-center justify-center border border-gray-200 shadow-inner">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center gap-2 mb-6 text-gray-500">
            <Eye className="w-5 h-5" /> <span className="text-sm font-bold">Live Preview</span>
          </div>
          
          <div ref={previewRef} className="shadow-2xl rounded-lg overflow-hidden ring-4 ring-white">
            <GraphicCard isFixedSize={false} />
          </div>

          <p className="text-xs text-center mt-6 text-gray-400 flex justify-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> 1080x1080 Social Ready
          </p>
        </div>
      </div>
    </div>
  );
}

export default function GeneratePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="relative max-w-7xl mx-auto px-4 py-8 pb-24">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-white shadow-sm px-4 py-2 rounded-full mb-4 border border-gray-200">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-gray-700 text-sm font-semibold">Meme Generator</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Make Truth Viral</h2>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <GenerateContent />
        </Suspense>
      </main>
      <BottomNav />
    </div>
  );
}