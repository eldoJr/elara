import React from 'react';
import SmartSearch from '../products/SmartSearch';

const SearchSection: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 tracking-tight">
            Find your perfect match.
          </h2>
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
            Discover products tailored to your needs with intelligent search.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <SmartSearch onProductSelect={(product) => console.log('Selected:', product)} />
        </div>
      </div>
    </section>
  );
};

export default SearchSection;