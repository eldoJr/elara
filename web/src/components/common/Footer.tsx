import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Shop */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
              Shop
            </h3>
            <ul className="space-y-2 text-sm">
              {['All Products', 'Electronics', 'Clothing', 'Beauty'].map((item) => (
                <li key={item}>
                  <Link 
                    to={`/products${item === 'All Products' ? '' : `?search=${item}`}`} 
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
              Support
            </h3>
            <ul className="space-y-2 text-sm">
              {['Help Center', 'Track Order', 'Returns', 'Contact'].map((item) => (
                <li key={item}>
                  <Link 
                    to="/support" 
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
              Account
            </h3>
            <ul className="space-y-2 text-sm">
              {['Sign In', 'Register', 'Profile', 'Orders'].map((item) => (
                <li key={item}>
                  <Link 
                    to={`/${item.toLowerCase().replace(' ', '')}`} 
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              {['About', 'Privacy', 'Terms', 'Careers'].map((item) => (
                <li key={item}>
                  <Link 
                    to="/about" 
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2024 Elara Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;