import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Star, TrendingUp, Sparkles, Heart } from 'lucide-react';
import api from '../../config/api';
import ModernLoading from './ModernLoading';

interface Product {
  id: number;
  title: string;
  thumbnail: string;
  price: number;
  brand?: string;
  category?: string;
  discountPercentage?: number;
}

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/api/products/');
      const allProducts = response.data.products || [];
      // Shuffle products for random display
      const shuffled = [...allProducts].sort(() => Math.random() - 0.5);
      setProducts(shuffled.slice(0, 12));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <ModernLoading size="lg" variant="spinner" />
      </div>
    );
  }

  const heroProduct = products[0];
  const featuredProducts = products.slice(1, 7);
  const trendingProducts = products.slice(7, 11);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Shopping
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-6">
              Elara
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover amazing products with intelligent recommendations tailored just for you
            </p>
          </div>

          {/* Hero Product */}
          {heroProduct && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-16 border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full text-sm font-medium mb-4 w-fit">
                    <Star className="w-3 h-3" />
                    Featured Product
                  </div>
                  {heroProduct.brand && (
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">
                      {heroProduct.brand}
                    </p>
                  )}
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                    {heroProduct.title}
                  </h2>
                  <div className="mb-8">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      ${heroProduct.discountPercentage 
                        ? (heroProduct.price * (1 - heroProduct.discountPercentage / 100)).toFixed(2)
                        : heroProduct.price.toFixed(2)
                      }
                    </span>
                    {heroProduct.discountPercentage && (
                      <span className="ml-3 text-xl text-gray-500 line-through">
                        ${heroProduct.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <Link
                      to={`/products/${heroProduct.id}`}
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      View Product
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      to="/products"
                      className="inline-flex items-center gap-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Browse All
                    </Link>
                  </div>
                </div>
                <div className="relative h-80 lg:h-auto">
                  <img
                    src={heroProduct.thumbnail}
                    alt={heroProduct.title}
                    className="w-full h-full object-cover"
                  />
                  {heroProduct.discountPercentage && (
                    <div className="absolute top-6 right-6 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      -{Math.round(heroProduct.discountPercentage)}% OFF
                    </div>
                  )}
                  <div className="absolute bottom-6 left-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">4.8</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-xl text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">1000+</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Products Available</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-xl text-center">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">50K+</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Happy Customers</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-xl text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">AI-Powered</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Smart Recommendations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Star className="w-4 h-4" />
                Handpicked for You
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Featured Products
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Discover our carefully selected products that customers love most
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product, index) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="group bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.discountPercentage && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        -{Math.round(product.discountPercentage)}%
                      </div>
                    )}
                    <div className={`absolute top-4 left-4 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                      index % 3 === 0 ? 'bg-blue-500' : index % 3 === 1 ? 'bg-green-500' : 'bg-purple-500'
                    }`}>
                      #{index + 1}
                    </div>
                  </div>
                  <div className="p-6">
                    {product.brand && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-2">
                        {product.brand}
                      </p>
                    )}
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {product.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
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
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">4.{Math.floor(Math.random() * 9) + 1}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trending Products */}
      {trendingProducts.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900/10 dark:to-pink-900/10">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-600 dark:text-purple-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <TrendingUp className="w-4 h-4" />
                Hot Right Now
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Trending Products
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                See what's popular and trending among our community
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingProducts.map((product, index) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  <div className="relative">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-400 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      🔥 #{index + 1}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {product.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-gray-900 dark:text-white">
                        ${product.discountPercentage 
                          ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
                          : product.price.toFixed(2)
                        }
                      </span>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">+{Math.floor(Math.random() * 50) + 10}%</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <ShoppingBag className="w-5 h-5" />
                Explore All Products
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
export default Home;