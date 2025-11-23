// src/components/ui/CategoryBadge.js
import { getCategoryName } from '@/data/sampleFactChecks';

export default function CategoryBadge({ category }) {
  const categoryStyles = {
    election: 'bg-red-100 text-red-800',
    religious: 'bg-orange-100 text-orange-800',
    scam: 'bg-blue-100 text-blue-800',
    health: 'bg-green-100 text-green-800'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryStyles[category]}`}>
      {getCategoryName(category)}
    </span>
  );
}