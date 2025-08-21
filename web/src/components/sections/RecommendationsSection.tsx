import React from 'react';
import RecommendedProducts from '../products/RecommendedProducts';

const RecommendationsSection: React.FC = () => {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="space-y-16">
          <RecommendedProducts type="trending" limit={6} />
          <RecommendedProducts type="personalized" limit={6} />
        </div>
      </div>
    </section>
  );
};

export default RecommendationsSection;