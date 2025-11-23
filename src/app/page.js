'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import FactCheckCard from '@/components/fact-checks/FactCheckCard';
import CategoryFilter from '@/components/fact-checks/CategoryFilter';
import { factChecks } from '@/data/sampleFactChecks';

export default function Home() {
  const [currentCategory, setCurrentCategory] = useState('all');

  const filteredFactChecks = currentCategory === 'all'
    ? factChecks
    : factChecks.filter(fc => fc.category === currentCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-800">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8 pb-24">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-2">
            সাম্প্রতিক তথ্য যাচাই
          </h2>
          <p className="text-purple-100 text-lg">
            নির্বাচন সংক্রান্ত ভুয়া তথ্য শনাক্তকরণ এবং সঠিক তথ্য প্রদান
          </p>
        </div>

        <CategoryFilter 
          currentCategory={currentCategory}
          onCategoryChange={setCurrentCategory}
        />

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 text-white text-center">
          <p className="text-sm">
            প্রদর্শিত হচ্ছে: <span className="font-bold">{filteredFactChecks.length}</span> টি তথ্য যাচাই
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFactChecks.map((factCheck) => (
            <FactCheckCard key={factCheck.id} factCheck={factCheck} />
          ))}
        </div>

        {filteredFactChecks.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center">
            <p className="text-gray-500 text-lg">
              এই বিভাগে কোনো তথ্য যাচাই নেই
            </p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}