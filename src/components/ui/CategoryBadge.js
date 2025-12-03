import { getCategoryName } from '@/data/sampleFactChecks';

export default function CategoryBadge({ category }) {
  const categoryConfig = {
    election: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      icon: '🗳️'
    },
    religious: {
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      border: 'border-orange-200',
      icon: '🕌'
    },
    scam: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      icon: '💰'
    },
    health: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
      icon: '🏥'
    }
  };

  const config = categoryConfig[category];

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border-2 ${config.bg} ${config.text} ${config.border} transition-all duration-300 hover:scale-105`}>
      <span>{config.icon}</span>
      {getCategoryName(category)}
    </span>
  );
}