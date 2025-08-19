import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../config/api';

interface Product {
  id: number;
  title: string;
  thumbnail: string;
  category: string;
}

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await api.get('/api/products/');
      const products = response.data.products || [];
      // Get 6 random products
      const shuffled = products.sort(() => 0.5 - Math.random());
      setFeaturedProducts(shuffled.slice(0, 6));
    } catch (error) {
      console.error('Error fetching featured products:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Product Showcase Slide */}
      <div className="py-16 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Bold Text */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-blue-600 bg-clip-text text-transparent">
                  Elara Store.
                </span>
                <br />
                The best way to buy the products you love.
              </h1>
            </div>
            
            {/* Right: Product Icons Row */}
            <div className="flex justify-center">
              <div className="grid grid-cols-3 gap-8">
                {featuredProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="group text-center hover:scale-105 transition-transform duration-200"
                  >
                    <div className="w-20 h-20 mx-auto mb-3 rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-200 dark:border-gray-700 group-hover:shadow-md transition-shadow">
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate max-w-20">
                      {product.title.split(' ').slice(0, 2).join(' ')}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-16">
          <div className="text-center">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 rounded-full">
                AI-Powered Shopping
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-light mb-4 tracking-tight">
              <span className="text-gray-900 dark:text-white">
                Welcome to 
              </span>
              <span className="font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Elara
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto font-light leading-relaxed">
              Discover products with intelligent recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/products"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Shop Now
              </Link>
              <Link
                to="/register"
                className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-900 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white dark:bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light mb-3 text-gray-900 dark:text-white tracking-tight">
              Why Elara?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto font-light">
              Three reasons to choose our platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
                Curated Selection
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                Thousands of products across categories with intelligent recommendations.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
                Secure & Private
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                Advanced encryption and privacy protection for all transactions.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
                AI-Powered
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                Personalized shopping experience with intelligent assistance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-3 text-gray-900 dark:text-white tracking-tight">
            Ready to get started?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 font-light">
            Join thousands of customers discovering products with AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/products"
              className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-900 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;