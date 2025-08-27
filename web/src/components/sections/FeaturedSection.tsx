import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface Product {
  id: number;
  title: string;
  thumbnail: string;
  price: number;
  brand?: string;
  category?: string;
  discountPercentage?: number;
}

interface FeaturedSectionProps {
  products: Product[];
}

const FeaturedSection: React.FC<FeaturedSectionProps> = ({ products }) => {
  const featuredProduct = products[0];
  const otherProducts = products.slice(1, 7);

  if (!featuredProduct) return null;

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-3">
            Featured
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Handpicked products that define excellence in design and innovation.
          </p>
        </div>

        {/* Main Featured Product */}
        <div className="mb-16">
          <Link 
            to={`/products/${featuredProduct.id}`}
            className="group block bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-all"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px]">
              {/* Product Image */}
              <div className="relative overflow-hidden">
                <img
                  src={featuredProduct.thumbnail}
                  alt={featuredProduct.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {featuredProduct.discountPercentage && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded text-sm font-medium">
                    -{Math.round(featuredProduct.discountPercentage)}% OFF
                  </div>
                )}
              </div>
              
              {/* Product Info */}
              <div className="flex flex-col justify-center p-6 lg:p-8">
                {featuredProduct.brand && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">
                    {featuredProduct.brand}
                  </p>
                )}
                <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-3 leading-tight">
                  {featuredProduct.title}
                </h3>
                <p className="text-base text-gray-600 dark:text-gray-400 mb-4">
                  Experience the perfect blend of innovation and elegance.
                </p>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl font-semibold text-gray-900 dark:text-white">
                    ${featuredProduct.discountPercentage 
                      ? (featuredProduct.price * (1 - featuredProduct.discountPercentage / 100)).toFixed(2)
                      : featuredProduct.price.toFixed(2)
                    }
                  </span>
                  {featuredProduct.discountPercentage && (
                    <span className="text-lg text-gray-500 line-through">
                      ${featuredProduct.price.toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:gap-2 transition-all">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherProducts.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="group block bg-white dark:bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700"
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.discountPercentage && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                    -{Math.round(product.discountPercentage)}%
                  </div>
                )}
              </div>
              
              <div className="p-4">
                {product.brand && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">
                    {product.brand}
                  </p>
                )}
                <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {product.title}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    ${product.discountPercentage 
                      ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
                      : product.price.toFixed(2)
                    }
                  </span>
                  {product.discountPercentage && (
                    <span className="text-sm text-gray-500 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            View All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;