import React from 'react';
import RecommendedProducts from '../products/RecommendedProducts';
import { TrendingUp, Heart, Star } from 'lucide-react';

const RecommendationsSection: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-32">
          {/* Trending Section */}
          <div>
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
              <h2 className="text-5xl md:text-6xl font-light text-gray-900 mb-4 tracking-tight">
                Trending
              </h2>
              <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
                Discover what's capturing hearts and minds in our community right now.
              </p>
            </div>
            <RecommendedProducts type="trending" limit={6} />
          </div>
          
          {/* Personalized Section */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 lg:p-16">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
              </div>
              <h2 className="text-5xl md:text-6xl font-light text-gray-900 mb-4 tracking-tight">
                Just for you
              </h2>
              <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
                Curated selections based on your unique taste and shopping history.
              </p>
            </div>
            <RecommendedProducts type="personalized" limit={6} />
          </div>

          {/* Top Rated Section */}
          <div>
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
              </div>
              <h2 className="text-5xl md:text-6xl font-light text-gray-900 mb-4 tracking-tight">
                Top Rated
              </h2>
              <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
                Products that have earned the highest praise from our customers.
              </p>
            </div>
            <RecommendedProducts type="top-rated" limit={6} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecommendationsSection;