import React from 'react';
import { Search } from 'lucide-react';
import SmartSearch from '../products/SmartSearch';

const SearchSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-8">
          <Search className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Smart Product Search</h2>
          <p className="text-gray-600">Find exactly what you need with AI-powered search</p>
        </div>
        <SmartSearch onProductSelect={(product) => console.log('Selected:', product)} />
      </div>
    </section>
  );
};

export default SearchSection;