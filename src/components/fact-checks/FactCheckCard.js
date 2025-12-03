import StatusBadge from '@/components/ui/StatusBadge';
import CategoryBadge from '@/components/ui/CategoryBadge';
import { formatDateBangla } from '@/data/sampleFactChecks';
import { Eye, Share2, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

export default function FactCheckCard({ factCheck }) {
  const { claim, verdict, status, category, source, date, views, shares, priority } = factCheck;

  const statusIcons = {
    false: AlertCircle,
    true: CheckCircle,
    misleading: AlertTriangle
  };

  const StatusIcon = statusIcons[status];

  return (
    <div className="group bg-white rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-gray-100 hover:border-red-300 hover:-translate-y-2 relative overflow-hidden">
      {/* Priority Indicator */}
      {priority === 'high' && (
        <div className="absolute top-0 right-0">
          <div className="bg-red-600 text-white px-3 py-1 text-xs font-bold rounded-bl-xl flex items-center gap-1">
            🔥 জরুরি
          </div>
        </div>
      )}

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-green-600 to-red-600"></div>
      
      {/* Header: Category and Status */}
      <div className="flex justify-between items-start mb-4 gap-2">
        <CategoryBadge category={category} />
        <StatusBadge status={status} />
      </div>

      {/* Status Icon & Claim */}
      <div className="flex gap-3 mb-3">
        <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
          status === 'false' ? 'bg-red-50' :
          status === 'true' ? 'bg-green-50' :
          'bg-amber-50'
        }`}>
          <StatusIcon className={`w-5 h-5 ${
            status === 'false' ? 'text-red-600' :
            status === 'true' ? 'text-green-600' :
            'text-amber-600'
          }`} />
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 line-clamp-3 flex-1 group-hover:text-red-600 transition-colors">
          {claim}
        </h3>
      </div>

      {/* Verdict */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-100">
        <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
          {verdict}
        </p>
      </div>

      {/* Footer: Source and Stats */}
      <div className="flex justify-between items-end pt-4 border-t-2 border-gray-100">
        <div>
          <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            সূত্র: <span className="font-semibold text-gray-700">{source}</span>
          </p>
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

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"></div>
    </div>
  );
}