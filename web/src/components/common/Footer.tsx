import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Shop */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Shop
            </h4>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">All Products</Link></li>
              <li><Link to="/products?category=electronics" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Electronics</Link></li>
              <li><Link to="/products?category=fashion" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Fashion</Link></li>
              <li><Link to="/products?category=beauty" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Beauty</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Account
            </h4>
            <ul className="space-y-2">
              <li><Link to="/login" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Sign In</Link></li>
              <li><Link to="/register" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Register</Link></li>
              <li><Link to="/orders" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">My Orders</Link></li>
              <li><Link to="/profile" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Profile</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Support
            </h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-gray-600 dark:text-gray-400">Help Center</span></li>
              <li><span className="text-sm text-gray-600 dark:text-gray-400">Track Order</span></li>
              <li><span className="text-sm text-gray-600 dark:text-gray-400">Returns</span></li>
              <li><span className="text-sm text-gray-600 dark:text-gray-400">Contact Us</span></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Company
            </h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-gray-600 dark:text-gray-400">About</span></li>
              <li><span className="text-sm text-gray-600 dark:text-gray-400">Privacy</span></li>
              <li><span className="text-sm text-gray-600 dark:text-gray-400">Terms</span></li>
              <li><span className="text-sm text-gray-600 dark:text-gray-400">Careers</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Link to="/" className="text-lg font-semibold text-gray-900 dark:text-white">
              Elara
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} Elara Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;