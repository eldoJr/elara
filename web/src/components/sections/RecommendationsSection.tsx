import React from 'react';
import RecommendedProducts from '../products/RecommendedProducts';

const RecommendationsSection: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-24">
          <div>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4 tracking-tight">
                Trending now.
              </h2>
              <p className="text-xl text-gray-600 font-light">
                Discover what's popular with our community.
              </p>
            </div>
            <RecommendedProducts type="trending" limit={6} />
          </div>
          
          <div>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4 tracking-tight">
                Just for you.
              </h2>
              <p className="text-xl text-gray-600 font-light">
                Personalized recommendations based on your preferences.
              </p>
            </div>
            <RecommendedProducts type="personalized" limit={6} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecommendationsSection;