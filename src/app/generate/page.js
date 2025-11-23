'use client';

import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { toast } from 'react-hot-toast';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import { getStatusName } from '@/data/sampleFactChecks';

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const downloadImage = async () => {
    if (!previewRef.current) return;

    setIsGenerating(true);
    toast.loading('ছবি তৈরি হচ্ছে...', { id: 'generating' });

    try {
      // Wait a bit for fonts to load
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: true
      });

      // Convert to blob and download
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-800">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8 pb-24">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-2">
            শেয়ারযোগ্য গ্রাফিক্স তৈরি করুন
          </h2>
          <p className="text-purple-100 text-lg">
            সঠিক তথ্য সোশ্যাল মিডিয়ায় শেয়ার করার জন্য গ্রাফিক্স তৈরি করুন
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              ✏️ কন্টেন্ট এডিট করুন
            </h3>

            {/* Claim */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                দাবি
              </label>
              <textarea
                name="claim"
                value={formData.claim}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none transition-colors resize-none"
                placeholder="মিথ্যা দাবিটি লিখুন..."
              />
            </div>

            {/* Status */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                সত্যতা
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none transition-colors"
              >
                <option value="false">❌ মিথ্যা</option>
                <option value="true">✅ সত্য</option>
                <option value="misleading">⚠️ বিভ্রান্তিকর</option>
              </select>
            </div>

            {/* Verdict */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ব্যাখ্যা
              </label>
              <textarea
                name="verdict"
                value={formData.verdict}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none transition-colors resize-none"
                placeholder="সংক্ষিপ্ত ব্যাখ্যা লিখুন..."
              />
            </div>

            {/* Source */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                সূত্র
              </label>
              <input
                type="text"
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-600 focus:outline-none transition-colors"
                placeholder="যাচাইকারী প্রতিষ্ঠান"
              />
            </div>

            {/* Template Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                টেমপ্লেট
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setSelectedTemplate('classic')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedTemplate === 'classic'
                      ? 'border-red-600 bg-red-50'
                      : 'border-gray-300 hover:border-red-300'
                  }`}
                >
                  <div className="w-full h-16 bg-gradient-to-br from-red-500 to-red-600 rounded mb-2"></div>
                  <p className="text-xs font-semibold">Classic</p>
                </button>

                <button
                  onClick={() => setSelectedTemplate('modern')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedTemplate === 'modern'
                      ? 'border-red-600 bg-red-50'
                      : 'border-gray-300 hover:border-red-300'
                  }`}
                >
                  <div className="w-full h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded mb-2"></div>
                  <p className="text-xs font-semibold">Modern</p>
                </button>

                <button
                  onClick={() => setSelectedTemplate('minimal')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedTemplate === 'minimal'
                      ? 'border-red-600 bg-red-50'
                      : 'border-gray-300 hover:border-red-300'
                  }`}
                >
                  <div className="w-full h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded mb-2"></div>
                  <p className="text-xs font-semibold">Minimal</p>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={downloadImage}
                disabled={isGenerating}
                className={`w-full py-4 rounded-lg font-bold text-white transition-all ${
                  isGenerating
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 hover:shadow-lg'
                }`}
              >
                {isGenerating ? '⏳ তৈরি হচ্ছে...' : '📥 ডাউনলোড করুন'}
              </button>

              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={shareToWhatsApp}
                  className="py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all text-sm"
                >
                  WhatsApp
                </button>
                <button
                  onClick={shareToFacebook}
                  className="py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all text-sm"
                >
                  Facebook
                </button>
                <button
                  onClick={shareToTwitter}
                  className="py-3 bg-sky-500 text-white rounded-lg font-semibold hover:bg-sky-600 transition-all text-sm"
                >
                  Twitter
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Preview */}
          <div className="bg-gray-100 rounded-xl p-6 flex items-center justify-center">
            <div className="w-full max-w-md">
              <p className="text-sm font-semibold text-gray-700 mb-4 text-center">
                লাইভ প্রিভিউ
              </p>
              
              {/* Preview Container */}
              <div 
                ref={previewRef}
                className={`w-full aspect-square rounded-xl shadow-2xl overflow-hidden ${
                  selectedTemplate === 'classic' ? 'bg-gradient-to-br from-red-500 to-red-700' :
                  selectedTemplate === 'modern' ? 'bg-gradient-to-br from-purple-500 to-pink-600' :
                  'bg-gradient-to-br from-gray-800 to-gray-900'
                }`}
                style={{ fontFamily: 'Hind Siliguri, sans-serif' }}
              >
                <div className="h-full flex flex-col p-8">
                  {/* Status Badge */}
                  <div className="mb-6">
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                      formData.status === 'false' ? 'bg-white text-red-600' :
                      formData.status === 'true' ? 'bg-white text-green-600' :
                      'bg-white text-amber-600'
                    }`}>
                      {getStatusName(formData.status)}
                    </span>
                  </div>

                  {/* Claim */}
                  <h2 className="text-2xl font-bold text-white mb-4 leading-tight">
                    {formData.claim}
                  </h2>

                  {/* Verdict */}
                  <p className="text-white/90 text-sm leading-relaxed mb-auto">
                    {formData.verdict}
                  </p>

                  {/* Footer */}
                  <div className="mt-6 pt-6 border-t-2 border-white/30">
                    <div className="flex justify-between items-center text-white">
                      <div>
                        <p className="text-lg font-bold">SattyoAlert</p>
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

              <p className="text-xs text-gray-600 text-center mt-4">
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