import StatusBadge from '@/components/ui/StatusBadge';
import CategoryBadge from '@/components/ui/CategoryBadge';
import { formatDateBangla } from '@/utils/dateUtils'; // Assuming you have this helper
import { Eye, Share2, AlertCircle, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';

export default function FactCheckCard({ factCheck }) {
  const { 
    claim, 
    verdict, 
    status, 
    category, 
    source = 'FactCheck Team', // Default source
    sourceUrl, 
    date, 
    views = 0, 
    shares = 0, 
    priority 
  } = factCheck;

  const statusIcons = {
    false: AlertCircle,
    verified: CheckCircle, // Use 'verified' to match Firebase
    misleading: AlertTriangle,
    pending: AlertCircle
  };

  const StatusIcon = statusIcons[status] || AlertCircle;

  // Handle card click - open source URL
  const handleCardClick = (e) => {
    // Prevent opening if clicking on specific interactive elements
    if (e.target.closest('.no-propagate')) {
      return;
    }
    if (sourceUrl) {
      window.open(sourceUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group bg-white rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-gray-100 hover:border-red-300 hover:-translate-y-2 relative overflow-hidden h-full flex flex-col"
    >
      {/* Priority Indicator */}
      {priority === 'High' && (
        <div className="absolute top-0 right-0 z-10">
          <div className="bg-red-600 text-white px-3 py-1 text-xs font-bold rounded-bl-xl flex items-center gap-1 shadow-sm">
            🔥 জরুরি
          </div>
        </div>
      )}

      {/* Decorative Elements (Status-based line) */}
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${
        status === 'verified' ? 'from-green-600 to-green-700' : 
        status === 'false' ? 'from-red-600 to-red-700' :
        'from-amber-500 to-amber-600'
      }`}></div>
      
      {/* Header: Category and Status */}
      <div className="flex justify-between items-start mb-4 gap-2 mt-2">
        <CategoryBadge category={category} />
        <StatusBadge status={status} />
      </div>

      {/* Status Icon & Claim */}
      <div className="flex gap-3 mb-3 flex-1">
        <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
          status === 'false' ? 'bg-red-50' :
          status === 'verified' ? 'bg-green-50' :
          'bg-amber-50'
        }`}>
          <StatusIcon className={`w-5 h-5 ${
            status === 'false' ? 'text-red-600' :
            status === 'verified' ? 'text-green-600' :
            'text-amber-600'
          }`} />
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 line-clamp-3 flex-1 group-hover:text-red-600 transition-colors font-bengali leading-snug">
          {claim}
        </h3>
      </div>

      {/* Verdict / Explanation */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-100">
        <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed font-medium">
          {verdict}
        </p>
      </div>

      {/* Footer: Source and Stats */}
      <div className="flex justify-between items-end pt-4 border-t-2 border-gray-100 mt-auto">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              সূত্র:
            </p>
            {sourceUrl ? (
              <a 
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="no-propagate text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {source}
                <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <span className="text-xs text-gray-400">সংরক্ষিত</span>
            )}
          </div>
          <p className="text-xs text-gray-400">{formatDateBangla(date)}</p>
        </div>
        
        <div className="flex gap-3">
          <div className="flex items-center gap-1 text-gray-500 hover:text-red-600 transition-colors">
            <Eye className="w-4 h-4" />
            <span className="text-xs font-semibold">{views.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500 hover:text-red-600 transition-colors">
            <Share2 className="w-4 h-4" />
            <span className="text-xs font-semibold">{shares.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Read More Indicator */}
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
        <div className="bg-slate-900 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg transform translate-y-2 group-hover:translate-y-0">
          বিস্তারিত পড়ুন
          <ExternalLink className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
}