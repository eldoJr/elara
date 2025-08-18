import React from 'react';

const Footer: React.FC = () => {
  const popularSearches = [
    'Makeup', 'Dresses', 'Tops', 'Sarees', 'Kurtas', 'Jeans', 'Sneakers', 'Jewelry', 'Watches', 'Bags',
    'Jackets', 'Shirts', 'T-Shirts', 'Shoes', 'Heels', 'Sunglasses', 'Perfumes', 'Skincare', 'Lipstick'
  ];

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Online Shopping */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
              Online Shopping
            </h3>
            <ul className="space-y-2 text-sm">
              {['Men', 'Women', 'Kids', 'Home & Living', 'Beauty', 'GenZ', 'Gift Cards', 'Elara Insider'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
              Useful Links
            </h3>
            <ul className="space-y-2 text-sm">
              {['Blog', 'Careers', 'Site Map', 'Corporate Information', 'Whitehat', 'Cleartrip', 'Elara Global'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Policies */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
              Customer Policies
            </h3>
            <ul className="space-y-2 text-sm">
              {['Contact Us', 'FAQ', 'Terms & Conditions', 'Track Orders', 'Shipping Info', 'Cancellation', 'Returns', 'Privacy Policy', 'Grievance Redressal'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Experience App & Social */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
              Experience Elara App
            </h3>
            <div className="space-y-3 mb-6">
              <a href="#" className="flex items-center gap-2 p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-pink-500 transition-colors">
                <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs">▶</span>
                </div>
                <span className="text-xs text-gray-700 dark:text-gray-300">Google Play</span>
              </a>
              <a href="#" className="flex items-center gap-2 p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-pink-500 transition-colors">
                <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
                  <span className="text-white text-xs">🍎</span>
                </div>
                <span className="text-xs text-gray-700 dark:text-gray-300">App Store</span>
              </a>
            </div>

            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">
              Keep in Touch
            </h4>
            <div className="flex gap-3">
              {[
                { name: 'Facebook', icon: 'f', color: 'bg-blue-600' },
                { name: 'Twitter', icon: 't', color: 'bg-blue-400' },
                { name: 'YouTube', icon: '▶', color: 'bg-red-600' },
                { name: 'Instagram', icon: '📷', color: 'bg-pink-600' }
              ].map((social) => (
                <a
                  key={social.name}
                  href="#"
                  className={`w-8 h-8 ${social.color} rounded-full flex items-center justify-center text-white text-xs hover:scale-110 transition-transform`}
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Guarantees */}
        <div className="flex flex-col md:flex-row gap-6 py-6 border-t border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">✓</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">100% ORIGINAL</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">guarantee for all products at elara.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">↩</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Return within 14 days</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">of receiving your order</p>
            </div>
          </div>
        </div>

        {/* Popular Searches */}
        <div className="py-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
            Popular Searches
          </h3>
          <div className="flex flex-wrap gap-1 text-xs text-gray-600 dark:text-gray-400">
            {popularSearches.map((search, index) => (
              <React.Fragment key={search}>
                <a href="#" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
                  {search}
                </a>
                {index < popularSearches.length - 1 && <span className="text-gray-400">|</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              © 2024 Elara. All rights reserved.
            </p>
            <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
              <a href="#" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;