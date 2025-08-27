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
      <section className="relative py-24 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500/20 to-pink-500/20 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-full text-sm font-medium mb-8 shadow-2xl">
              <Sparkles className="w-5 h-5 text-orange-400" />
              <span className="bg-gradient-to-r from-blue-200 to-pink-200 bg-clip-text text-transparent font-semibold">
                Next-Gen AI Shopping Experience
              </span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black mb-8">
              <span className="bg-gradient-to-r from-blue-400 via-orange-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">
                ELARA
              </span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-white/90 max-w-4xl mx-auto leading-relaxed mb-12 font-light">
              The <span className="text-orange-400 font-semibold">Future</span> of Shopping is Here
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/products"
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-6 h-6" />
                  <span>Explore Products</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity -z-10"></div>
              </Link>
              
              <div className="flex items-center gap-4 text-white/80">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full border-2 border-white/30"></div>
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full border-2 border-white/30"></div>
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-orange-500 rounded-full border-2 border-white/30"></div>
                </div>
                <span className="text-sm font-medium">Join 50K+ Happy Customers</span>
              </div>
            </div>
          </div>

          {/* Hero Product Showcase */}
          {heroProduct && (
            <div className="relative group">
              {/* Glowing border effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-orange-500 to-pink-500 rounded-3xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
              
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="p-10 lg:p-16 flex flex-col justify-center">
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500/20 to-pink-500/20 backdrop-blur-sm border border-orange-300/30 text-orange-300 px-4 py-2 rounded-full text-sm font-semibold mb-6 w-fit">
                      <Star className="w-4 h-4 text-orange-400" />
                      <span>SPOTLIGHT PRODUCT</span>
                    </div>
                    
                    {heroProduct.brand && (
                      <p className="text-blue-300 font-bold mb-3 text-lg tracking-wide uppercase">
                        {heroProduct.brand}
                      </p>
                    )}
                    
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                      {heroProduct.title}
                    </h2>
                    
                    <div className="mb-10">
                      <div className="flex items-baseline gap-4">
                        <span className="text-5xl font-black bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                          ${heroProduct.discountPercentage 
                            ? (heroProduct.price * (1 - heroProduct.discountPercentage / 100)).toFixed(2)
                            : heroProduct.price.toFixed(2)
                          }
                        </span>
                        {heroProduct.discountPercentage && (
                          <span className="text-2xl text-white/60 line-through">
                            ${heroProduct.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      {heroProduct.discountPercentage && (
                        <div className="mt-3 inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                          <span>🔥 SAVE {Math.round(heroProduct.discountPercentage)}%</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link
                        to={`/products/${heroProduct.id}`}
                        className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold rounded-2xl shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105"
                      >
                        <div className="flex items-center justify-center gap-3">
                          <span>GET THIS PRODUCT</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </Link>
                      
                      <Link
                        to="/products"
                        className="px-8 py-4 border-2 border-white/30 text-white hover:bg-white/10 font-semibold rounded-2xl transition-all duration-300 backdrop-blur-sm"
                      >
                        View All Products
                      </Link>
                    </div>
                  </div>
                  
                  <div className="relative h-96 lg:h-auto overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-pink-500/20"></div>
                    <img
                      src={heroProduct.thumbnail}
                      alt={heroProduct.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Floating elements */}
                    <div className="absolute top-8 right-8 bg-white/20 backdrop-blur-xl border border-white/30 px-4 py-3 rounded-2xl">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="text-white font-bold">4.9</span>
                      </div>
                    </div>
                    
                    <div className="absolute bottom-8 left-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/30 px-6 py-3 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-white font-semibold text-sm">In Stock • Fast Shipping</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Futuristic Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl text-center hover:transform hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
                  <ShoppingBag className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-black text-white mb-2">1000+</h3>
                <p className="text-blue-200 font-medium">Premium Products</p>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl text-center hover:transform hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-black text-white mb-2">50K+</h3>
                <p className="text-orange-200 font-medium">Happy Customers</p>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl text-center hover:transform hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-black text-white mb-2">AI</h3>
                <p className="text-pink-200 font-medium">Smart Technology</p>
              </div>
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