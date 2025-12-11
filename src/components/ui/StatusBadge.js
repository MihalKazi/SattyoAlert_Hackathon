import { XCircle, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

export default function StatusBadge({ status }) {
  
  // Mapping Firebase status ('verified', 'false', 'misleading') to display text
  const getStatusName = (stat) => {
    if (stat === 'verified') return 'সত্য যাচাই';
    if (stat === 'false') return 'মিথ্যা প্রমাণ';
    if (stat === 'misleading') return 'বিভ্রান্তিকর';
    return 'যাচাই চলছে';
  };

  const statusConfig = {
    false: {
      color: 'bg-gradient-to-r from-red-600 to-red-700',
      text: 'text-white',
      border: 'border-red-700',
      icon: XCircle,
      glow: 'shadow-lg shadow-red-500/50'
    },
    verified: { // Changed from 'true' to 'verified' for Firebase
      color: 'bg-gradient-to-r from-green-600 to-green-700',
      text: 'text-white',
      border: 'border-green-700',
      icon: CheckCircle,
      glow: 'shadow-lg shadow-green-500/50'
    },
    misleading: {
      color: 'bg-gradient-to-r from-amber-500 to-amber-600',
      text: 'text-white',
      border: 'border-amber-600',
      icon: AlertTriangle,
      glow: 'shadow-lg shadow-amber-500/50'
    },
    pending: {
      color: 'bg-gradient-to-r from-gray-500 to-gray-600',
      text: 'text-white',
      border: 'border-gray-600',
      icon: Clock,
      glow: 'shadow-lg shadow-gray-500/50'
    }
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-2 ${config.color} ${config.text} ${config.border} ${config.glow} transition-all duration-300 hover:scale-110`}>
      <Icon className="w-3.5 h-3.5" />
      {getStatusName(status)}
    </span>
  );
}