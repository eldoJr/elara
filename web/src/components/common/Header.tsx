import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useSearch } from './SearchProvider';
import ThemeToggle from './ThemeToggle';
import SearchOverlay from './SearchOverlay';

const Header: React.FC = () => {
  const { isDark } = useTheme();
  const { isSearchActive, setIsSearchActive, toggleSearch } = useSearch();
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('username') !== null;
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/');
  };

  return (
    <div className="relative">
      <div className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-12">
            {/* Left Side - Logo/Brand */}
            <div className="flex items-center">
              {isLoggedIn && (
                <span className="ml-4 text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                  Welcome, <span className="font-medium text-blue-600 dark:text-blue-400">{username}</span>
                </span>
              )}
            </div>
            
            {/* Right Side - Actions */}
            <div className="flex items-center gap-2">
              <button 
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={toggleSearch}
              >
                Search
              </button>
              
              <Link 
                to="/products" 
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Products
              </Link>
              
              {isLoggedIn ? (
                <>
                  <Link 
                    to="/orders" 
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    Orders
                  </Link>
                  <Link 
                    to="/profile" 
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    Sign Up
                  </Link>
                  <Link
                    to="/login"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                </>
              )}
              
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
      
      <SearchOverlay 
        isOpen={isSearchActive} 
        onClose={() => setIsSearchActive(false)} 
      />
    </div>
  );
};

export default Header;