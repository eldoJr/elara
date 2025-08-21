import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShoppingBag } from 'lucide-react';

interface Product {
  id: number;
  title: string;
  thumbnail: string;
  price: number;
}

interface HeroSectionProps {
  featuredProducts: Product[];
  onAIAssistantClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ featuredProducts, onAIAssistantClick }) => {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Shop <span className="text-blue-600">Smarter</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            AI-powered shopping experience with personalized recommendations
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/products"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Browse Products
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <button
              onClick={onAIAssistantClick}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-medium border-2 border-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              AI Assistant
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="group bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all"
              >
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-full h-20 object-cover rounded-lg mb-2 group-hover:scale-105 transition-transform"
                />
                <p className="text-sm font-medium text-gray-800 truncate">{product.title}</p>
                <p className="text-blue-600 font-bold">${product.price}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;