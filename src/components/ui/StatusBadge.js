// src/components/ui/StatusBadge.js
import { getStatusName } from '@/data/sampleFactChecks';

export default function StatusBadge({ status }) {
  const statusStyles = {
    false: 'bg-red-600 text-white',
    true: 'bg-green-600 text-white',
    misleading: 'bg-amber-500 text-white'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusStyles[status]}`}>
      {getStatusName(status)}
    </span>
  );
}