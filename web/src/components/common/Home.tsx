import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Package, Shield, Zap } from 'lucide-react';
import api from '../../config/api';
import AIAssistant from '../ai/AIAssistant';
import SmartSearch from '../products/SmartSearch';
import RecommendedProducts from '../products/RecommendedProducts';

interface Product {
  id: number;
  title: string;
  thumbnail: string;
  category: string;
  price: number;
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
      const shuffled = products.sort(() => 0.5 - Math.random());
      setFeaturedProducts(shuffled.slice(0, 6));
    } catch (error) {
      console.error('Error fetching featured products:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Product Showcase Slide */}
      <div className="py-20 bg-gradient-to-br from-orange-50/30 via-pink-50/30 to-blue-50/30 dark:from-orange-950/20 dark:via-pink-950/20 dark:to-blue-950/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-[1.1] tracking-tight">
                <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-blue-600 bg-clip-text text-transparent">
                  Elara Store.
                </span>
                <br />
                <span className="text-gray-900 dark:text-white font-light">
                  The best way to buy the products you love.
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 font-light max-w-lg">
                Discover curated products with AI-powered recommendations tailored just for you.
              </p>
            </div>
            
            <div className="flex justify-center lg:justify-end">
              <div className="grid grid-cols-3 gap-6">
                {featuredProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="group text-center transition-all duration-300 hover:-translate-y-2"
                  >
                    <div className="w-24 h-24 mx-auto mb-3 rounded-3xl overflow-hidden bg-white dark:bg-gray-900 shadow-lg border border-gray-100 dark:border-gray-800 group-hover:shadow-xl transition-all duration-300">
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-200 truncate max-w-24">
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
      <div className="py-24 bg-white dark:bg-black">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="mb-8">
            <span className="inline-flex items-center px-4 py-2 text-sm font-medium bg-gradient-to-r from-orange-100 via-pink-100 to-blue-100 dark:from-orange-900/30 dark:via-pink-900/30 dark:to-blue-900/30 text-gray-700 dark:text-gray-100 rounded-full border border-gray-200 dark:border-gray-700">
              ✨ AI-Powered Shopping Experience
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-light mb-6 tracking-tight">
            <span className="text-gray-900 dark:text-white">
              Shop 
            </span>
            <span className="font-medium bg-gradient-to-r from-orange-500 via-pink-500 to-blue-600 bg-clip-text text-transparent">
              Smarter
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            Experience the future of e-commerce with personalized recommendations and intelligent product discovery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="group bg-gradient-to-r from-orange-500 via-pink-500 to-blue-600 hover:from-orange-600 hover:via-pink-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-medium text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span className="flex items-center justify-center gap-2">
                Explore Products
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              to="/register"
              className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-8 py-4 rounded-2xl font-medium text-lg border-2 border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Join Free
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light mb-4 text-gray-900 dark:text-white tracking-tight">
              Built for 
              <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-blue-600 bg-clip-text text-transparent font-medium">
                Everyone
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light">
              Three pillars that make Elara the perfect shopping destination
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group text-center p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Package className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Curated Collection
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                Hand-picked products across all categories with quality guaranteed and intelligent recommendations.
              </p>
            </div>

            <div className="group text-center p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900/30 dark:to-pink-800/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Secure & Trusted
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                Bank-level security with end-to-end encryption protecting your data and transactions at all times.
              </p>
            </div>

            <div className="group text-center p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                AI-Powered
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                Smart recommendations and personalized shopping experience powered by advanced machine learning.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gradient-to-r from-orange-500 via-pink-500 to-blue-600">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-light">50K+</div>
              <div className="text-orange-100 font-light text-sm">Products</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-light">10K+</div>
              <div className="text-pink-100 font-light text-sm">Happy Customers</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-light">99.9%</div>
              <div className="text-blue-100 font-light text-sm">Uptime</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-light">24/7</div>
              <div className="text-white/80 font-light text-sm">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Search Section */}
      <div className="py-20 bg-white dark:bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-light mb-4 text-gray-900 dark:text-white tracking-tight">
              Smart 
              <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-blue-600 bg-clip-text text-transparent font-medium">
                Product Search
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light">
              Find exactly what you're looking for with AI-powered semantic search
            </p>
          </div>
          
          <SmartSearch onProductSelect={(product) => console.log('Selected:', product)} />
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="py-20 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-6 space-y-16">
          <RecommendedProducts type="trending" limit={6} />
          <RecommendedProducts type="personalized" limit={6} />
        </div>
      </div>

      {/* AI Assistant Section */}
      <div className="py-20 bg-white dark:bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-light mb-4 text-gray-900 dark:text-white tracking-tight">
              Meet Your 
              <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-blue-600 bg-clip-text text-transparent font-medium">
                AI Assistant
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light">
              Get personalized product recommendations and shopping assistance powered by advanced AI
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <AIAssistant />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-white dark:bg-black">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-light mb-6 text-gray-900 dark:text-white tracking-tight">
            Start your 
            <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-blue-600 bg-clip-text text-transparent font-medium">
              journey
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 font-light max-w-2xl mx-auto">
            Join thousands of customers discovering amazing products with personalized AI recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-gradient-to-r from-orange-500 via-pink-500 to-blue-600 hover:from-orange-600 hover:via-pink-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-medium text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Get Started Free
            </Link>
            <Link
              to="/products"
              className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white px-8 py-4 rounded-2xl font-medium text-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Explore Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;