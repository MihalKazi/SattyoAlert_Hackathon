'use client';

import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { toast } from 'react-hot-toast';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import { getStatusName } from '@/data/sampleFactChecks';
import { Download, Share2, Palette, Eye, Sparkles } from 'lucide-react';

export default function GeneratePage() {
  const [formData, setFormData] = useState({
    claim: 'ইভিএম মেশিন দূর থেকে হ্যাক করা যায়',
    status: 'false',
    verdict: 'নির্বাচন কমিশন নিশ্চিত করেছে যে সব ইভিএম মেশিন সম্পূর্ণ অফলাইন এবং কোনো ইন্টারনেট সংযোগ নেই।',
    source: 'Boom Bangladesh'
  });

  const [selectedTemplate, setSelectedTemplate] = useState('classic');
  const [isGenerating, setIsGenerating] = useState(false);
  const previewRef = useRef(null);

  const templates = [
    { 
      id: 'classic', 
      name: 'Classic', 
      gradient: 'from-indigo-600 to-blue-700',
      preview: 'from-indigo-600 to-blue-600'
    },
    { 
      id: 'modern', 
      name: 'Modern', 
      gradient: 'from-slate-700 to-slate-900',
      preview: 'from-slate-700 to-slate-800'
    },
    { 
      id: 'minimal', 
      name: 'Minimal', 
      gradient: 'from-gray-800 to-gray-900',
      preview: 'from-gray-700 to-gray-900'
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const downloadImage = async () => {
    if (!previewRef.current) return;

    setIsGenerating(true);
    toast.loading('ছবি তৈরি হচ্ছে...', { id: 'generating' });

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: true
      });

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `sattyoalert-fact-check-${Date.now()}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);

        toast.success('✅ ছবি ডাউনলোড সম্পন্ন!', { id: 'generating' });
        setIsGenerating(false);
      });
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('ছবি তৈরিতে সমস্যা হয়েছে', { id: 'generating' });
      setIsGenerating(false);
    }
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(`${formData.claim}\n\n${getStatusName(formData.status)}: ${formData.verdict}\n\nসূত্র: ${formData.source}\n\nSattyoAlert থেকে যাচাই করা হয়েছে 🔍`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}`, '_blank');
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(`${formData.claim} - ${getStatusName(formData.status)}\n\nসূত্র: ${formData.source}\n\n#SattyoAlert #FactCheck #Bangladesh`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50">
      {/* Professional Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-100 via-indigo-50 to-blue-100"></div>
      
      {/* Subtle Geometric Shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-100/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-10 w-96 h-96 bg-indigo-100/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-slate-100/20 rounded-full blur-3xl"></div>
      </div>

      {/* Dots Pattern Overlay */}
      <div className="fixed inset-0 opacity-10" style={{
        backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
        backgroundSize: '30px 30px',
      }}></div>

      <Header />
      
      <main className="relative max-w-7xl mx-auto px-4 py-8 pb-24">
        {/* Page Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-white shadow-sm px-4 py-2 rounded-full mb-4 border border-gray-200">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-gray-700 text-sm font-semibold">Graphics Studio</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            শেয়ারযোগ্য গ্রাফিক্স তৈরি করুন
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            সঠিক তথ্য সোশ্যাল মিডিয়ায় শেয়ার করার জন্য গ্রাফিক্স তৈরি করুন
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Form */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200 hover-lift animate-slide-up">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                কন্টেন্ট এডিট করুন
              </h3>
            </div>

            {/* Claim */}
            <div className="mb-5">
              <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <span className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 text-xs">1</span>
                দাবি
              </label>
              <textarea
                name="claim"
                value={formData.claim}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 focus:outline-none transition-all resize-none hover:border-gray-300"
                placeholder="মিথ্যা দাবিটি লিখুন..."
              />
            </div>

            {/* Status */}
            <div className="mb-5">
              <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <span className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 text-xs">2</span>
                সত্যতা
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 focus:outline-none transition-all hover:border-gray-300 cursor-pointer"
              >
                <option value="false">❌ মিথ্যা</option>
                <option value="true">✅ সত্য</option>
                <option value="misleading">⚠️ বিভ্রান্তিকর</option>
              </select>
            </div>

            {/* Verdict */}
            <div className="mb-5">
              <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <span className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 text-xs">3</span>
                ব্যাখ্যা
              </label>
              <textarea
                name="verdict"
                value={formData.verdict}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 focus:outline-none transition-all resize-none hover:border-gray-300"
                placeholder="সংক্ষিপ্ত ব্যাখ্যা লিখুন..."
              />
            </div>

            {/* Source */}
            <div className="mb-6">
              <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <span className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 text-xs">4</span>
                সূত্র
              </label>
              <input
                type="text"
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 focus:outline-none transition-all hover:border-gray-300"
                placeholder="যাচাইকারী প্রতিষ্ঠান"
              />
            </div>

            {/* Template Selection */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-3">
                টেমপ্লেট নির্বাচন করুন
              </label>
              <div className="grid grid-cols-3 gap-3">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`group p-4 rounded-2xl border-3 transition-all duration-300 ${
                      selectedTemplate === template.id
                        ? 'border-indigo-600 bg-indigo-50 scale-105 shadow-lg'
                        : 'border-gray-200 hover:border-indigo-300 hover:scale-105'
                    }`}
                  >
                    <div className={`w-full h-20 bg-gradient-to-br ${template.preview} rounded-xl mb-3 shadow-md group-hover:shadow-lg transition-shadow`}></div>
                    <p className={`text-xs font-bold text-center ${
                      selectedTemplate === template.id ? 'text-indigo-600' : 'text-gray-700'
                    }`}>
                      {template.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={downloadImage}
                disabled={isGenerating}
                className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                  isGenerating
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:shadow-xl hover:scale-105'
                }`}
              >
                {isGenerating ? (
                  <>
                    <div className="spinner"></div>
                    <span>তৈরি হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>ডাউনলোড করুন</span>
                  </>
                )}
              </button>

              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={shareToWhatsApp}
                  className="py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all text-sm hover:scale-105 shadow-md"
                >
                  WhatsApp
                </button>
                <button
                  onClick={shareToFacebook}
                  className="py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all text-sm hover:scale-105 shadow-md"
                >
                  Facebook
                </button>
                <button
                  onClick={shareToTwitter}
                  className="py-3 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-xl font-semibold hover:from-sky-600 hover:to-sky-700 transition-all text-sm hover:scale-105 shadow-md"
                >
                  Twitter
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Preview */}
          <div className="bg-white rounded-3xl p-8 flex items-center justify-center border border-gray-200 shadow-xl animate-slide-up delay-200">
            <div className="w-full max-w-md">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Eye className="w-5 h-5 text-gray-700" />
                <p className="text-sm font-bold text-gray-700">লাইভ প্রিভিউ</p>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              
              {/* Preview Container */}
              <div 
                ref={previewRef}
                className={`w-full aspect-square rounded-3xl shadow-2xl overflow-hidden bg-gradient-to-br ${selectedTemplateData.gradient} hover:scale-105 transition-transform duration-300`}
                style={{ fontFamily: 'Hind Siliguri, sans-serif' }}
              >
                <div className="h-full flex flex-col p-8">
                  {/* Status Badge */}
                  <div className="mb-6">
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                      formData.status === 'false' ? 'bg-white text-red-600' :
                      formData.status === 'true' ? 'bg-white text-green-600' :
                      'bg-white text-amber-600'
                    }`}>
                      {getStatusName(formData.status)}
                    </span>
                  </div>

                  {/* Claim */}
                  <h2 className="text-2xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                    {formData.claim}
                  </h2>

                  {/* Verdict */}
                  <p className="text-white/90 text-sm leading-relaxed mb-auto drop-shadow-md">
                    {formData.verdict}
                  </p>

                  {/* Footer */}
                  <div className="mt-6 pt-6 border-t-2 border-white/30">
                    <div className="flex justify-between items-center text-white">
                      <div>
                        <p className="text-lg font-bold drop-shadow-md">SattyoAlert</p>
                        <p className="text-xs opacity-80">সত্য Alert</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs opacity-80">সূত্র:</p>
                        <p className="text-sm font-semibold">{formData.source}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-500 text-center mt-4 flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                ছবিটি 1080x1080px (Instagram/Facebook সাইজ)
              </p>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}