// src/components/fact-checks/FactCheckCard.js
import StatusBadge from '@/components/ui/StatusBadge';
import CategoryBadge from '@/components/ui/CategoryBadge';
import { formatDateBangla } from '@/data/sampleFactChecks';

export default function FactCheckCard({ factCheck }) {
  const { claim, verdict, status, category, source, date, views, shares } = factCheck;

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-red-600 hover:shadow-lg transition-all duration-300 cursor-pointer">
      {/* Header: Category and Status */}
      <div className="flex justify-between items-start mb-4">
        <CategoryBadge category={category} />
        <StatusBadge status={status} />
      </div>

      {/* Claim */}
      <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
        {claim}
      </h3>

      {/* Verdict */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
        {verdict}
      </p>

      {/* Footer: Source and Stats */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div>
          <p className="text-xs text-gray-500">সূত্র: {source}</p>
          <p className="text-xs text-gray-400">{formatDateBangla(date)}</p>
        </div>
        <div className="flex gap-4 text-xs text-gray-500">
          <span>👁️ {views.toLocaleString()}</span>
          <span>📤 {shares.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}