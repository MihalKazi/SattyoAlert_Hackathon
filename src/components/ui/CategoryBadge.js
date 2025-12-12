import { Vote, Moon, DollarSign, HeartPulse, FileText } from 'lucide-react';

export default function CategoryBadge({ category }) {
  
  // Mapping Firebase category to display text
  const getCategoryName = (cat) => {
    if (cat === 'election') return 'নির্বাচন';
    if (cat === 'religious') return 'ধর্মীয়';
    if (cat === 'scam') return 'স্ক্যাম';
    if (cat === 'health') return 'স্বাস্থ্য';
    return 'অন্যান্য';
  };

  const categoryConfig = {
    election: {
      color: 'bg-red-50 text-red-700 border-red-200',
      icon: Vote
    },
    religious: {
      color: 'bg-orange-50 text-orange-700 border-orange-200',
      icon: Moon 
    },
    scam: {
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: DollarSign
    },
    health: {
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: HeartPulse
    },
    'default': {
      color: 'bg-slate-50 text-slate-700 border-slate-200',
      icon: FileText
    }
  };

  const config = categoryConfig[category] || categoryConfig['default'];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${config.color} shadow-sm uppercase tracking-wide`}>
      <Icon className="w-3 h-3" />
      {getCategoryName(category)}
    </span>
  );
}