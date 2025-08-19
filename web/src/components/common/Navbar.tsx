import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import { useSearch } from './SearchProvider';
import logo from '../../assets/logo.svg';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toggleSearch } = useSearch();

  const categories = [
    { name: 'Electronics', color: 'from-blue-500 to-blue-600' },
    { name: 'Clothing', color: 'from-pink-500 to-pink-600' },
    { name: 'Books', color: 'from-orange-500 to-orange-600' },
    { name: 'Beauty', color: 'from-pink-400 to-pink-500' },
    { name: 'Sports', color: 'from-blue-400 to-blue-500' }
  ];

  return (
    <nav className="bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 ">
                <img src={logo} alt="Elara Logo" className="w-6 h-6" />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link
              to="/products"
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-4 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Store
            </Link>
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/products?search=${category.name}`}
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-4 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {category.name}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-3">
            <Link 
              to="/support" 
              className="hidden sm:block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Support
            </Link>
            
            <button 
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={toggleSearch}
            >
              <Search className="w-5 h-5" />
            </button>
            
            <Link 
              to="/cart" 
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
            </Link>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
        isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-white/95 dark:bg-black/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50">
          <div className="px-6 py-4 space-y-2">
            <Link
              to="/products"
              className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-4 py-3 text-base font-medium rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Store
            </Link>
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/products?search=${category.name}`}
                className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-4 py-3 text-base font-medium rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
            <Link
              to="/support"
              className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-4 py-3 text-base font-medium rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Support
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;