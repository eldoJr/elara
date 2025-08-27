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
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-light tracking-tight text-gray-900 mb-4">
            Featured
          </h2>
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
            Handpicked products that define excellence in design and innovation.
          </p>
        </div>

        {/* Main Featured Product */}
        <div className="mb-20">
          <Link 
            to={`/products/${featuredProduct.id}`}
            className="group block bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-700 hover:scale-[1.02]"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
              {/* Product Image */}
              <div className="relative overflow-hidden">
                <img
                  src={featuredProduct.thumbnail}
                  alt={featuredProduct.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {featuredProduct.discountPercentage && (
                  <div className="absolute top-6 right-6 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                    -{Math.round(featuredProduct.discountPercentage)}% OFF
                  </div>
                )}
              </div>
              
              {/* Product Info */}
              <div className="flex flex-col justify-center p-8 lg:p-12">
                {featuredProduct.brand && (
                  <p className="text-sm uppercase tracking-wider text-gray-500 mb-2 font-medium">
                    {featuredProduct.brand}
                  </p>
                )}
                <h3 className="text-3xl md:text-4xl font-light text-gray-900 mb-4 leading-tight">
                  {featuredProduct.title}
                </h3>
                <p className="text-lg text-gray-600 mb-6 font-light">
                  Experience the perfect blend of innovation and elegance.
                </p>
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-3xl font-light text-gray-900">
                    ${featuredProduct.discountPercentage 
                      ? (featuredProduct.price * (1 - featuredProduct.discountPercentage / 100)).toFixed(2)
                      : featuredProduct.price.toFixed(2)
                    }
                  </span>
                  {featuredProduct.discountPercentage && (
                    <span className="text-xl text-gray-500 line-through">
                      ${featuredProduct.price.toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="flex items-center text-black font-medium group-hover:gap-3 transition-all duration-300">
                  <span>Learn more</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {otherProducts.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="group block bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {product.discountPercentage && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    -{Math.round(product.discountPercentage)}%
                  </div>
                )}
              </div>
              
              <div className="p-6">
                {product.brand && (
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-2 font-medium">
                    {product.brand}
                  </p>
                )}
                <h3 className="text-lg font-medium text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {product.title}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-medium text-gray-900">
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
        <div className="text-center mt-16">
          <Link
            to="/products"
            className="inline-flex items-center gap-3 bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-full font-medium transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
          >
            View All Products
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;