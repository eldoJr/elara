import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  const popularSearches = [
    'Electronics', 'Clothing', 'Beauty', 'Books', 'Sports', 'Home', 'Jewelry', 'Watches', 
    'Shoes', 'Bags', 'Skincare', 'Makeup', 'Perfumes', 'Sunglasses', 'Headphones'
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold bg-gradient-to-r from-orange-500 via-pink-500 to-blue-600 bg-clip-text text-transparent mb-3">
                Elara Store
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                AI-powered e-commerce platform delivering personalized shopping experiences with curated products.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Mail className="w-4 h-4 text-orange-500" />
                <span>support@elara.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Phone className="w-4 h-4 text-pink-500" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
              Shop
            </h3>
            <ul className="space-y-3 text-sm">
              {['All Products', 'Electronics', 'Clothing', 'Beauty', 'Books', 'Sports', 'New Arrivals'].map((item) => (
                <li key={item}>
                  <Link 
                    to={`/products${item === 'All Products' ? '' : `?search=${item}`}`} 
                    className="text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
              Support
            </h3>
            <ul className="space-y-3 text-sm">
              {['Help Center', 'Track Order', 'Shipping Info', 'Returns', 'Size Guide', 'Contact Us', 'FAQ'].map((item) => (
                <li key={item}>
                  <Link 
                    to="/support" 
                    className="text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
              Connect
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                {[
                  { Icon: Facebook, color: 'hover:text-blue-600', name: 'Facebook' },
                  { Icon: Twitter, color: 'hover:text-blue-400', name: 'Twitter' },
                  { Icon: Instagram, color: 'hover:text-pink-500', name: 'Instagram' },
                  { Icon: Youtube, color: 'hover:text-red-500', name: 'YouTube' }
                ].map(({ Icon, color, name }) => (
                  <a
                    key={name}
                    href="#"
                    className={`p-2 text-gray-500 dark:text-gray-400 ${color} rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-200`}
                    title={name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
              <div className="space-y-2">
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Download Our App</p>
                <div className="flex gap-2">
                  <a href="#" className="px-3 py-2 bg-black text-white text-xs rounded-lg hover:bg-gray-800 transition-colors">
                    App Store
                  </a>
                  <a href="#" className="px-3 py-2 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors">
                    Google Play
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 border-t border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">✓</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">100% Authentic</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Guaranteed original products</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">↩</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Easy Returns</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">14-day return policy</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">🚚</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Free Shipping</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">On orders over $50</p>
            </div>
          </div>
        </div>

        {/* Popular Searches */}
        <div className="py-8">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
            Popular Searches
          </h3>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((search) => (
              <Link
                key={search}
                to={`/products?search=${search}`}
                className="px-3 py-1 text-xs bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-200"
              >
                {search}
              </Link>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2024 Elara. All rights reserved. Built with ❤️ for amazing shopping experiences.
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400 transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;