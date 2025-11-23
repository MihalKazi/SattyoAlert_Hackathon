// src/components/layout/Header.js
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Make logo clickable - goes to homepage */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              ✓
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SattyoAlert</h1>
              <p className="text-sm text-gray-600">সত্য Alert</p>
            </div>
          </Link>
          
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
            🔔 Enable Alerts
          </button>
        </div>
      </div>
    </header>
  );
}