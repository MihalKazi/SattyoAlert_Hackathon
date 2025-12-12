import StatusBadge from '@/components/ui/StatusBadge'; 
import CategoryBadge from '@/components/ui/CategoryBadge'; // <--- Imported
import { formatDateBangla } from '@/utils/dateUtils'; 
import { Eye, Share2, AlertCircle, CheckCircle, AlertTriangle, ExternalLink, XCircle } from 'lucide-react';

export default function FactCheckCard({ factCheck }) {
  const { 
    claim, 
    verdict, 
    status, 
    category, 
    source = 'FactCheck Team', 
    sourceUrl, 
    date, 
    views = 0, 
    shares = 0, 
    priority 
  } = factCheck;

  // Visual Config for the CARD BORDER & BACKGROUND ICON
  const cardConfig = {
    'false': { 
      border: 'border-t-red-600', 
      bgIcon: XCircle, 
      bgTint: 'text-red-600'
    },
    'verified': { 
      border: 'border-t-green-600', 
      bgIcon: CheckCircle, 
      bgTint: 'text-green-600'
    },
    'misleading': { 
      border: 'border-t-amber-500', 
      bgIcon: AlertTriangle, 
      bgTint: 'text-amber-500'
    },
    'pending': { 
      border: 'border-t-gray-400', 
      bgIcon: AlertCircle, 
      bgTint: 'text-gray-400'
    }
  };

  const config = cardConfig[status] || cardConfig['pending'];
  const BackgroundIcon = config.bgIcon;

  const handleCardClick = (e) => {
    if (e.target.closest('.no-propagate')) return;
    if (sourceUrl) window.open(sourceUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`group bg-white rounded-xl shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer border-t-4 ${config.border} border-x border-b border-gray-100 relative overflow-hidden h-full flex flex-col p-5`}
    >
      {/* Background Decoration */}
      <div className={`absolute -right-6 -top-6 opacity-[0.03] transform group-hover:scale-110 group-hover:opacity-[0.06] transition-all duration-500 pointer-events-none ${config.bgTint}`}>
        <BackgroundIcon className="w-40 h-40" />
      </div>

      {/* Priority Indicator */}
      {priority === 'High' && (
        <div className="absolute top-0 right-0 z-10">
          <div className="bg-red-600 text-white px-3 py-1 text-[10px] font-bold uppercase rounded-bl-xl shadow-sm flex items-center gap-1 animate-pulse">
            🔥 জরুরি
          </div>
        </div>
      )}

      {/* --- HEADER: BADGES --- */}
      <div className="flex justify-between items-center mb-4 relative z-10 gap-2">
        {/* 1. Status Badge */}
        <StatusBadge status={status} />
        
        {/* 2. Category Badge (Now Correctly Used) */}
        <CategoryBadge category={category} />
      </div>

      {/* Claim */}
      <div className="mb-4 relative z-10">
        <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-red-700 transition-colors line-clamp-3">
          {claim}
        </h3>
      </div>

      {/* Verdict */}
      <div className="bg-slate-50/80 rounded-lg p-3 mb-4 border border-slate-100 relative z-10 backdrop-blur-sm">
        <p className="text-sm text-slate-700 font-medium line-clamp-3 leading-relaxed">
          {verdict}
        </p>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-auto relative z-10">
        <div className="flex flex-col">
           <div className="flex items-center gap-1.5 mb-0.5">
             <div className={`w-1.5 h-1.5 rounded-full ${config.bgTint.replace('text-', 'bg-')}`}></div>
             <span className="text-[10px] text-slate-400 uppercase font-bold">উৎস</span>
           </div>
           
           {sourceUrl ? (
             <a 
               href={sourceUrl}
               target="_blank"
               rel="noopener noreferrer"
               className="no-propagate text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 transition-colors"
               onClick={(e) => e.stopPropagation()}
             >
               {source} <ExternalLink className="w-3 h-3" />
             </a>
           ) : (
             <span className="text-xs font-medium text-slate-500">সংরক্ষিত</span>
           )}
           
           <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
             {date?.toDate ? formatDateBangla(date.toDate()) : 'তারিখ নেই'}
           </p>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-slate-100 shadow-sm">
            <Eye className="w-3 h-3 text-slate-400" />
            <span className="text-xs font-bold text-slate-600">{views.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1 p-1 hover:bg-slate-100 rounded-full transition-colors cursor-pointer">
            <Share2 className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
}