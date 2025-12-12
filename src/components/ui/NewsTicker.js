import { AlertCircle, CheckCircle } from 'lucide-react';

export default function NewsTicker({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="bg-white border-b border-gray-200 overflow-hidden py-2.5 relative shadow-sm z-30">
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 45s linear infinite;
          width: max-content;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="animate-marquee flex items-center gap-8 pl-4">
        {[...items, ...items, ...items, ...items].map((rawItem, i) => {
          
          // 1. Clean the input (remove accidental spaces)
          const item = rawItem.trim();

          // 2. SMART CHECK: Looks for keywords even if format isn't perfect
          const isVerified = item.startsWith('সত্য') || item.startsWith('Verified');
          
          // 3. Remove the prefix ("সত্য:", "Verified-", etc) so only the news shows
          // This Regex removes: "সত্য", then optional colon/dash/space
          const displayText = item.replace(/^(সত্য|Verified|সতর্কতা|Alert)[:\-\s]*/i, '').trim();

          return (
            <div key={i} className="flex items-center gap-3 flex-shrink-0">
              
              {isVerified ? (
                // --- GREEN STYLE ---
                <span className="flex items-center gap-2 text-sm font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  {displayText}
                </span>
              ) : (
                // --- RED STYLE ---
                <span className="flex items-center gap-2 text-sm font-bold text-red-700 bg-red-50 px-3 py-1 rounded-full border border-red-100">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  {displayText}
                </span>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
}