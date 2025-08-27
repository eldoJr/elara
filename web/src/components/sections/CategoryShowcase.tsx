import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  image?: string;
}

interface CategoryShowcaseProps {
  categories: Category[];
}

const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({ categories }) => {
  // Default category images for better visual appeal
  const defaultImages = [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop'
  ];

  const getCategoryImage = (category: Category, index: number) => {
    return category.image || defaultImages[index % defaultImages.length];
  };

  if (!categories.length) return null;

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-light tracking-tight text-gray-900 mb-4">
            Categories
          </h2>
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
            Explore our carefully curated collections designed for every lifestyle.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={`/products?category=${encodeURIComponent(category.name)}`}
              className="group relative overflow-hidden rounded-3xl bg-white shadow-sm hover:shadow-2xl transition-all duration-700 hover:scale-105"
            >
              {/* Category Image */}
              <div className="relative h-80 overflow-hidden">
                <img
                  src={getCategoryImage(category, index)}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              </div>
              
              {/* Category Info */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-2xl font-light text-white mb-2">
                  {category.name}
                </h3>
                <div className="flex items-center text-white/90 group-hover:text-white group-hover:gap-3 transition-all duration-300">
                  <span className="font-light">Explore collection</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Special Highlight Section */}
        <div className="bg-gradient-to-r from-gray-900 to-black rounded-3xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px]">
            <div className="flex flex-col justify-center p-8 lg:p-12 text-white">
              <h3 className="text-4xl md:text-5xl font-light mb-4 tracking-tight">
                New Arrivals
              </h3>
              <p className="text-xl font-light text-gray-300 mb-8 leading-relaxed">
                Be the first to discover our latest collection of premium products, 
                carefully selected for the modern lifestyle.
              </p>
              <Link
                to="/products?sort=newest"
                className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-gray-100 transition-all duration-300 hover:scale-105 active:scale-95 w-fit"
              >
                Shop New Arrivals
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            
            <div className="relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop"
                alt="New Arrivals"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;