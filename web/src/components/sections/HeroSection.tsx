import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShoppingBag } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-semibold text-gray-900 dark:text-white mb-4">
          Elara
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Discover products with AI-powered recommendations and personalized shopping experience.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <ShoppingBag className="w-4 h-4" />
          Shop Now
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;