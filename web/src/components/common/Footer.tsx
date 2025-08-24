import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Shop */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-6">
              Shop
            </h3>
            <ul className="space-y-4 text-sm">
              {['All Products', 'Electronics', 'Clothing', 'Beauty', 'New Arrivals'].map((item) => (
                <li key={item}>
                  <Link 
                    to={`/products${item === 'All Products' ? '' : `?search=${item}`}`} 
                    className="text-gray-600 hover:text-gray-900 transition-colors font-light"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-6">
              Support
            </h3>
            <ul className="space-y-4 text-sm">
              {['Help Center', 'Track Order', 'Returns', 'Contact Us'].map((item) => (
                <li key={item}>
                  <Link 
                    to="/support" 
                    className="text-gray-600 hover:text-gray-900 transition-colors font-light"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-6">
              Account
            </h3>
            <ul className="space-y-4 text-sm">
              {['Sign In', 'Create Account', 'Order Status', 'Profile'].map((item) => (
                <li key={item}>
                  <Link 
                    to={item === 'Sign In' ? '/login' : item === 'Create Account' ? '/register' : '/profile'} 
                    className="text-gray-600 hover:text-gray-900 transition-colors font-light"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-6">
              Elara
            </h3>
            <ul className="space-y-4 text-sm">
              {['About Us', 'Careers', 'Privacy Policy', 'Terms'].map((item) => (
                <li key={item}>
                  <Link 
                    to="/about" 
                    className="text-gray-600 hover:text-gray-900 transition-colors font-light"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-600 font-light">
              Copyright © 2024 Elara Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;