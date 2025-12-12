export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm animate-pulse h-full">
      {/* Badge Placeholder */}
      <div className="flex justify-between items-start mb-4">
        <div className="h-6 bg-slate-200 rounded-full w-24"></div>
        <div className="h-4 bg-slate-200 rounded-full w-16"></div>
      </div>
      
      {/* Title Placeholders */}
      <div className="space-y-2 mb-6">
        <div className="h-4 bg-slate-200 rounded w-full"></div>
        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
      </div>

      {/* Footer Placeholders */}
      <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-50">
        <div className="h-8 bg-slate-200 rounded w-20"></div>
        <div className="h-8 bg-slate-200 rounded w-20"></div>
      </div>
    </div>
  );
}